const express = require("express");
const userModel = require("../model/userModel");
const userRouter = express.Router();
// Register User route
userRouter.post("/registerUser", async (req, res) => {
  const { name, emailId, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ where: { emailId } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const createUser = await userModel.create({ name, emailId, password });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      data: createUser,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const existingUser = await userModel.findOne({
      where: { emailId, password },
    });
    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "User LoggedIn Successfully",
        emailId: existingUser.emailId,
        password: existingUser.password,
      });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Invalid login Credentials" });
    }
  } catch (error) {
    console.log(error.message);
  }
});

userRouter.get("/registerUser", async (req, res) => {
  try {
    const getUser = await userModel.findAll();
    res.status(200).json({
      success: true,
      message: "users fetched successfully",
      data: getUser,
    });
  } catch (error) {
    console.log(error.message);
  }
});

userRouter.delete("/User/:id", async (req, res) => {
  try {
    await userModel.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = userRouter;
