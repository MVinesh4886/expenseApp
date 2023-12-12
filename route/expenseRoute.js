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

expenseRouter.post("/create/:userId", isLogin, CreateExpense);

expenseRouter.get("/get", isLogin, GetAllExpense);

expenseRouter.get("/getSingle/:userId", isLogin, GetSingleExpense);

expenseRouter.put("/put/:id", isLogin, UpdateExpense);

expenseRouter.delete("/delete/:userId", isLogin, DeleteExpense);

expenseRouter.get("/showleaderboard", isLogin, ShowLeaderBoard);

expenseRouter.get("/download/:userId", isLogin, Download);

module.exports = expenseRouter;
