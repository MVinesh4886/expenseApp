const express = require("express");
const userRouter = express.Router();
const {
  RegisterUser,
  LoginUser,
  VerifyEmail,
  ForgotPassword,
  ResetPassword,
  GetAllUsers,
  GetSingleUser,
  DeleteUser,
} = require("../controller/userController");

// Register User route
userRouter.post("/registerUser", RegisterUser);

// Login route
userRouter.post("/login", LoginUser);

// Email verification
userRouter.get("/verifyEmail/:Token", VerifyEmail);

userRouter.get("/registerUser", GetAllUsers);

userRouter.post("/forgotPassword", ForgotPassword);

// Reset password
userRouter.post("/resetPassword", ResetPassword);

// userRouter.get("/registerUser/:id", GetSingleUser);

userRouter.delete("/User/:id", DeleteUser);

module.exports = userRouter;
