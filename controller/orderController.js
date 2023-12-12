const Razorpay = require("razorpay");
const orderModel = require("../model/orderModel");
const userModel = require("../model/userModel");
const generateToken = require("../utils/generateToken");

const GetPurchasePremium = async (req, res) => {
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
      success: true,
      message: "You are a Premium User Now",
      orderId: order.id,
      order,
      key_id: razorpay.key_id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to purchase premium",
    });
  }
};

const UpdateTransactionStatus = async (req, res) => {
  try {
    const { paymentId, orderId } = req.body;
    const findOrder = await orderModel.findOne({ where: { orderId } });
    await findOrder.update({
      paymentId,
      orderId,
      userId,
      status: "SUCCESSFUL",
    });

    const userId = req.params.userId;
    const user = await userModel.findByPk(userId);
    const updatedUser = await user.update({ isPremiumUser: true });

    const Token = generateToken(updatedUser);
    return res.status(202).json({
      success: true,
      message: "Transactions updated successfully",
      token: Token,
    });
  } catch (error) {
    console.log(error);
    res
      .status(401)
      .json({ error: error.message, message: "Something went Wrong" });
  }
};

module.exports = {
  GetPurchasePremium,
  UpdateTransactionStatus,
};
