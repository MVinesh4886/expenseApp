const expenseModel = require("../model/expenseModel");
const userModel = require("../model/userModel");
const sequelize = require("sequelize");
const db = require("../config/database");
const AWS = require("aws-sdk");

const CreateExpense = async (req, res) => {
  //
  const t = await db.transaction();
  try {
    const { amount, description, category } = req.body;

    // Update totalExpenses in userModel
    const userId = req.params.userId;
    const user = await userModel.findByPk(userId);
    const totalExpenses = Number(user.totalExpenses) + Number(amount);
    await user.update({ totalExpenses });

    const newTracker = await expenseModel.create(
      {
        amount,
        description,
        category,
      },
      { transaction: t }
    );

    await expenseModel.update(
      { userId },
      { where: { id: newTracker.id }, transaction: t }
    );

    await t.commit();
    console.log(newTracker);
    res.status(200).json({
      success: true,
      data: newTracker,
    });
  } catch (error) {
    await t.rollback();
    console.log(error);
    res.status(400).json({ message: "Internal server error" });
  }
};

const GetAllExpense = async (req, res) => {
  try {
    const gettracker = await expenseModel.findAll();
    res.status(200).json({
      success: true,
      data: gettracker,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal server error" });
  }
};

const GetSingleExpense = async (req, res) => {
  try {
    const userId = req.params.userId;
    const tracker = await expenseModel.findAll({ where: { userId: userId } });
    if (!tracker) {
      return res.status(404).json({ message: "tracker not found" });
    }
    res.json(tracker);
  } catch (error) {
    res.status(400).json({ message: "Internal server error" });
  }
};

const UpdateExpense = async (req, res) => {
  try {
    const findExpense = await expenseModel.findByPk(req.params.id);
    if (!findExpense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }
    const { amount, description, category } = req.body;
    await expenseModel.update(
      { amount, description, category },
      {
        where: { id: req.params.id },
      }
    );
    const updatedExpense = await expenseModel.findByPk(req.params.id);
    return res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const DeleteExpense = async (req, res) => {
  try {
    //To delete the expense, we extract the id from route using req.params object.
    const expenseId = req.params.id;

    // using, the expenseId we delete the expense
    const expense = await expenseModel.findByPk(expenseId);

    const deletedTracker = await expenseModel.destroy({
      where: { id: expenseId },
    });

    if (deletedTracker === 0) {
      return res.status(500).json({ message: "tracker not found" });
    }

    //Since we have deleted the expense, Update the totalExpenses in userModel
    const userId = expense.userId;
    const amount = expense.amount;
    const user = await userModel.findByPk(userId);
    const totalExpenses = Number(user.totalExpenses) - Number(amount);
    await user.update({ totalExpenses });

    res.status(200).json({
      success: true,
      data: "tracker has been deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({ message: "internal server error" });
  }
};

const ShowLeaderBoard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;
    const size = parseInt(req.query.size) || 10;

    const leaderboard = await userModel.findAll({
      attributes: [
        "id",
        "name",

        [sequelize.fn("sum", sequelize.col("expenses.amount")), "total_cost"],
      ],
      include: [
        {
          model: expenseModel,
          attributes: [],
        },
      ],
      group: ["user.id"],
      order: [["total_cost", "DESC"]],
    });

    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedLeaderboard = leaderboard.slice(startIndex, endIndex);

    console.log(paginatedLeaderboard);
    res.json({ leaderboard: paginatedLeaderboard });
    // console.log(leaderboard);
    // res.json({ leaderboard });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

async function uploadToS3(data, filename) {
  const bucketName = "expensetrackerapp4321";
  const userKey = process.env.ACCESS_KEYID;
  const secretKey = process.env.SECRET_KEYID;

  const s3Bucket = new AWS.S3({
    accessKeyId: userKey,
    secretAccessKey: secretKey,
  });

  const params = {
    Bucket: bucketName,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };

  try {
    const s3response = await s3Bucket.upload(params).promise();
    console.log("Successfully uploaded", s3response);
    return s3response.Location; // Return the URL of the uploaded file
  } catch (err) {
    console.log("Something went wrong", err);
  }
}

const Download = async (req, res) => {
  try {
    const download = await userModel.findAll();
    console.log(download);
    const stringifiedExpenses = JSON.stringify(download);
    const userId = req.params.userId;
    const filename = `Expense${userId}/${new Date()}.txt`;

    const fileUrl = uploadToS3(stringifiedExpenses, filename);
    console.log(fileUrl);
    res.status(200).json({ fileUrl, success: true });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  CreateExpense,
  GetAllExpense,
  GetSingleExpense,
  DeleteExpense,
  UpdateExpense,
  Download,
  ShowLeaderBoard,
};
