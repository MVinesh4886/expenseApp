const express = require("express");
const userModel = require("../model/userModel");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");

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

    const Token = generateToken(
      createUser.id,
      createUser.emailId,
      createUser.name
    );

    await createUser.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "vineshkrishna26@gmail.com",
        pass: "kfkt dktq hfox tmkj",
      },
    });

    const mailOptions = {
      from: "vineshkrishna26@gmail.com",
      to: emailId,
      subject: "Email Verification",
      text: `Please verify your email by clicking the following link: http://localhost:8000/verifyEmail/${Token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
      } else {
        console.log("Email sent:", info.response);
        res.json({ message: "Email sent" });
      }
    });

    return res.status(200).json({
      success: true,
      message: "User registered successfully, Please verify your email",
      id: createUser.id,
      name: createUser.name,
      emailId: createUser.emailId,
      password: createUser.password,
      token: Token,
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

    const isPremiumUser = null;

    if (existingUser) {
      // if the existing user is not verified
      if (!existingUser.isVerified) {
        res.status(401).json({
          success: false,
          message: "Email not verified. Please verify your email first.",
        });
      }
      const isPasswordMatched = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (isPasswordMatched) {
        const Token = generateToken(
          existingUser.id,
          existingUser.name,
          existingUser.emailId,
          isPremiumUser
        );

        // Update the user's token in the database or local storage
        existingUser.token = Token;
        await existingUser.save();

        return res.status(200).json({
          success: true,
          message: "User LoggedIn Successfully",
          emailId: existingUser.emailId,
          password: existingUser.password,
          userId: existingUser.id,
          token: Token,
        });
      }
    }

    return res
      .status(400)
      .json({ success: false, message: "Invalid login credentials" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// Email verification
userRouter.get("/verifyEmail/:Token", async (req, res) => {
  const token = req.params.Token;
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decodedToken.id;
    const user = await userModel.findByPk(userId);
    console.log(user);

    user.isVerified = true;
    await user.save();

    return res.json({ message: "Email verified successfully" });
  } catch (error) {
    console.log("Error verifying email:", error);
    res.status(500).json({ error: "Failed to verify email" });
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

userRouter.post("/forgotPassword", async (req, res) => {
  const { emailId } = req.body;

  try {
    // Find the user by their email
    const user = await userModel.findOne({ where: { emailId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Generate a unique token for the password reset link
    const Token = generateToken(user.id);
    console.log(Token);

    // Save the token in the user's record in the database
    user.resetPasswordToken = Token;
    await user.save();

    // Send an email to the user with the password reset link
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "vineshkrishna26@gmail.com",
        pass: "kfkt dktq hfox tmkj",
      },
    });

    const mailOptions = {
      from: "vineshkrishna26@gmail.com",
      to: emailId,
      subject: "Reset Your Password",
      text: `http://127.0.0.1:5501/frontend/ResetPassword.html`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email" });
      } else {
        console.log("Email sent:", info.response);
        res.json({ message: "Email sent" });
      }
    });
  } catch (error) {
    console.log("Error initiating password reset:", error);
    res.status(500).json(error);
  }
});

// Reset password
userRouter.post("/resetPassword", async (req, res) => {
  const { emailId, password } = req.body;

  try {
    const user = await userModel.findOne({ where: { emailId } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully", user });
  } catch (error) {
    console.log("Error resetting password:", error);
    res.status(500).json(error);
  }
});

userRouter.get("/registerUser/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const getUser = await userModel.findByPk(id);
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
