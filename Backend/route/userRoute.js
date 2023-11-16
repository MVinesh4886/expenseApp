const express = require("express");
const userModel = require("../model/userModel");
const userRouter = express.Router();
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

const SibApiV3Sdk = require("sib-api-v3-sdk");
const defaultClient = SibApiV3Sdk.ApiClient.instance;
var apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.API_KEY;

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
    return res.status(200).json({
      success: true,
      message: "User registered successfully",
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
      const isPasswordMatched = await bcrypt.compare(
        password,
        existingUser.password
      );
      if (isPasswordMatched) {
        //Generate a new Token
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
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

userRouter.post("/password/forgotPassword", async function (req, res) {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
    sender: { email: "vineshkrishna26@gmail.com", name: "Vinesh" },
    subject: "This is my default subject line",
    htmlContent:
      "<!DOCTYPE html><html><body><h1>My First Heading</h1><p>My first paragraph.</p></body></html>",
    params: {
      greeting: "This is the default greeting",
      headline: "This is the default headline",
    },
    messageVersions: [
      //Definition for Message Version 1
      {
        to: [
          {
            emailId: req.body.emailId,
          },
        ],
        htmlContent:
          "<!DOCTYPE html><html><body><h1>Modified header!</h1><p>This is still a paragraph</p></body></html>",
        subject: "We are happy to be working with you",
      },
    ],
  });
  try {
    const sendEmail = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("API called successfully. Returned data: " + data);
    res.status(200).send(sendEmail);
  } catch (error) {
    console.error(error);
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
