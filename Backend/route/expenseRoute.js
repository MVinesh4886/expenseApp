const express = require("express");

const isLogin = require("../middleware/Auth");
const {
  CreateExpense,
  GetAllExpense,
  GetSingleExpense,
  DeleteExpense,
  UpdateExpense,
  Download,
  ShowLeaderBoard,
} = require("../controller/expenseController");
const expenseRouter = express.Router();

expenseRouter.post("/expense/create", isLogin, CreateExpense);

expenseRouter.get("/expense/get", isLogin, GetAllExpense);

expenseRouter.get("/expense/getSingle/:id", isLogin, GetSingleExpense);

expenseRouter.put("/expense/put/:id", isLogin, UpdateExpense);

expenseRouter.delete("/expense/delete/:id", isLogin, DeleteExpense);

expenseRouter.get("/expense/showleaderboard", isLogin, ShowLeaderBoard);

// function uploadToS3(data, filename) {
//   const bucketName = "expensetrackerapp4321";
//   const userKey = process.env.ACCESS_KEYID;
//   const secretKey = process.env.SECRET_KEYID;

//   let s3Bucket = new AWS.S3({
//     accessKeyId: userKey,
//     secretAccessKey: secretKey,
//     // Bucket: bucketName,
//   });

//   var params = {
//     Bucket: bucketName,
//     Key: filename,
//     Body: data,
//     ACL: "public-read",
//   };
//   s3Bucket.upload(params, (err, s3response) => {
//     if (err) {
//       console.log("Something went wrong", err);
//     } else {
//       console.log("Successfully uploaded", s3response);
//     }
//   });
// }

// async function uploadToS3(data, filename) {
//   const bucketName = "expensetrackerapp4321";
//   const userKey = process.env.ACCESS_KEYID;
//   const secretKey = process.env.SECRET_KEYID;

//   const s3Bucket = new AWS.S3({
//     accessKeyId: userKey,
//     secretAccessKey: secretKey,
//   });

//   const params = {
//     Bucket: bucketName,
//     Key: filename,
//     Body: data,
//     ACL: "public-read",
//   };

//   try {
//     const s3response = await s3Bucket.upload(params).promise();
//     console.log("Successfully uploaded", s3response);
//     return s3response.Location; // Return the URL of the uploaded file
//   } catch (err) {
//     console.log("Something went wrong", err);
//   }
// }

expenseRouter.get("/expense/download", isLogin, Download);

// expenseRouter.get("/expense/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await userModel.findByPk(id);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const page = parseInt(req.query.page) || 0;
//     const size = parseInt(req.query.size) || 10;

//     const pagination = await expenseModel.findAndCountAll({
//       where: { userId: id },
//       limit: size,
//       offset: page * size,
//     });

//     res.status(200).json({
//       success: true,
//       pagination,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

module.exports = expenseRouter;
