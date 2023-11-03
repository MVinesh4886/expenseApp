const express = require("express");
const userModel = require("../model/userModel");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createUser = await userModel.create({
      name,
      emailId,
      password: hashedPassword,
    });

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

// Login route
userRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    const existingUser = await userModel.findOne({
      where: { emailId },
    });
    if (existingUser) {
      const isPasswordMatched = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (isPasswordMatched) {
        return res.status(200).json({
          success: true,
          message: "User LoggedIn Successfully",
          emailId: existingUser.emailId,
          password: existingUser.password,
        });
      }
    }
    return res
      .status(400)
      .json({ success: false, message: "Invalid login credentials" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
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
