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
} = require("../../Backend/controller/userController");

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

userRouter.get("/registerUser/:id", GetSingleUser);

userRouter.delete("/User/:id", DeleteUser);

// userRouter.get("/user", async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 0;
//     const size = parseInt(req.query.size) || 10;

//     const pagination = await userModel.findAndCountAll({
//       // where: { userId: id },
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

module.exports = userRouter;
