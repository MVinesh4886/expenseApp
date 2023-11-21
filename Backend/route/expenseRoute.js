const express = require("express");
const expenseModel = require("../model/expenseModel");
const isLogin = require("../middleware/Auth");
const userModel = require("../model/userModel");
const sequelize = require("sequelize");
const db = require("../config/database");

const expenseRouter = express.Router();

expenseRouter.post("/expense/create", isLogin, async (req, res) => {
  const t = await db.transaction();
  try {
    const { amount, description, category } = req.body;
    const userId = req.body.userId; // Assuming the userId is passed as a parameter

    // Update totalExpenses in userModel
    const user = await userModel.findByPk(userId);
    const totalExpenses = Number(user.totalExpenses) + Number(amount);
    await user.update({ totalExpenses });

    const newTracker = await expenseModel.create(
      {
        amount,
        description,
        category,
        userId,
      },
      { transaction: t }
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
});

expenseRouter.get("/expense/get", async (req, res) => {
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
});

expenseRouter.get("/expense/getSingle/:id", async (req, res) => {
  try {
    const userId = req.body.userId;
    const tracker = await expenseModel.findAll({ where: { userId: userId } });
    if (!tracker) {
      return res.status(404).json({ message: "tracker not found" });
    }
    res.json(tracker);
  } catch (error) {
    res.status(400).json({ message: "Internal server error" });
  }
});

expenseRouter.put("/expense/put/:id", isLogin, async (req, res) => {
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
});

expenseRouter.delete("/expense/delete/:id", isLogin, async (req, res) => {
  try {
    const expenseId = req.params.id; // Get the expenseId from the URL parameter
    const userId = req.body.userId; // Get the userId from the request body

    // Get the amount of the expense to be deleted
    const expense = await expenseModel.findByPk(expenseId);
    const amount = expense.amount;

    // Update totalExpenses in userModel
    const user = await userModel.findByPk(userId);
    const totalExpenses = Number(user.totalExpenses) - Number(amount);
    await user.update({ totalExpenses });

    const deletedTracker = await expenseModel.destroy({
      where: { id: expenseId, userId: userId },
    });
    if (deletedTracker === 0) {
      return res.status(500).json({ message: "tracker not found" });
    }
    res.status(200).json({
      success: true,
      data: "tracker has been deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({ message: "internal server error" });
  }
});

expenseRouter.get("/expense/showleaderboard", isLogin, async (req, res) => {
  try {
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
    console.log(leaderboard);
    res.send(leaderboard);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
});

expenseRouter.get("/expense/download", isLogin, async (req, res) => {
  try {
    const download = await userModel.findAll();
    console.log(download);
  } catch (error) {
    console.log(error);
  }
});

module.exports = expenseRouter;
