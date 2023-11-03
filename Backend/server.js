const express = require("express");
const dotenv = require("dotenv").config();
require("./model/userModel");
const db = require("./config/database");
const userRouter = require("./route/userRoute");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "DELETE"],
  })
);

app.use(userRouter);
db.sync()
  .then((result) => {
    // console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server is listening on  port ${PORT}`);
});
