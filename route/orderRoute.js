const express = require("express");

const isLogin = require("../middleware/Auth");
const {
  GetPurchasePremium,
  UpdateTransactionStatus,
} = require("../controller/orderController");

const orderRoute = express.Router();

orderRoute.get("/purchasePremium", isLogin, GetPurchasePremium);

orderRoute.post(
  "/updateTransactionStatus/:userId",
  isLogin,
  UpdateTransactionStatus
);

module.exports = orderRoute;
