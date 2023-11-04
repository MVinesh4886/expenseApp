const express = require("express");
const userModel = require("./model/userModel");
const expenseModel = require("./model/expenseModel");
const db = require("./config/database");
const userRouter = require("./route/userRoute");
const expenseRouter = require("./route/expenseRoute");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://127.0.0.1:5501",
    methods: ["GET", "POST", "DELETE"],
  })
);

app.use(expenseRouter);
app.use(userRouter);

userModel.hasMany(expenseModel, { foreignKey: "userId" });
expenseModel.belongsTo(userModel, { foreignKey: "userId" });

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
