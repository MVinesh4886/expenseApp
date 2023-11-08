const express = require("express");
const Razorpay = require("razorpay");
const orderModel = require("../model/orderModel");
const isLogin = require("../middleware/Auth");
const userModel = require("../model/userModel");

const orderRoute = express.Router();

orderRoute.get("/purchasePremium", isLogin, async (req, res) => {
  try {
    var razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 2500;

    const order = await razorpay.orders.create({
      amount, // Amount in paise (e.g., 2500 paise = Rs 25)
      currency: "INR",
    });

    await orderModel.create({
      orderId: order.id,
      status: "PENDING",
    });

    res.json({
      orderId: order.id,
      order,
      key_id: razorpay.key_id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to purchase premium",
    });
  }
});

orderRoute.post("/updateTransactionStatus", isLogin, async (req, res) => {
  try {
    const { paymentId, orderId, userId } = req.body;
    const findOrder = await orderModel.findOne({ where: { orderId } });
    await findOrder.update({
      paymentId,
      orderId,
      userId,
      status: "SUCCESSFUL",
    });

    const user = await userModel.findOne({
      where: { isPremiumUser },
    });
    await user.update({ isPremiumUser: true });
    return res
      .status(202)
      .json({ success: true, message: "Transactions updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json({ error: error.message, message: "Something went Wrong" });
  }
});

module.exports = orderRoute;
