require("dotenv").config();

const express = require("express");
const userModel = require("./model/userModel");
const expenseModel = require("./model/expenseModel");
const db = require("./config/database");
const userRouter = require("./route/userRoute");
const expenseRouter = require("./route/expenseRoute");
const orderRoute = require("./route/orderRoute");
const orderModel = require("./model/orderModel");
const path = require("path");
// const helmet = require("helmet");
// const compression = require("compression");

const cors = require("cors");

const app = express();

app.use(express.json());
// app.use(helmet());
// app.use(compression());

app.use(
  cors({
    origin: "http://localhost:8000",
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);

app.use("/expense", expenseRouter);
app.use("/user", userRouter);
app.use("/order", orderRoute);

app.use((req, res) => {
  // console.log(__dirname);
  res.sendFile(path.join(__dirname + `/public/${req.url}`));
});

userModel.hasMany(expenseModel, { foreignKey: "userId" });
expenseModel.belongsTo(userModel, { foreignKey: "userId" });

userModel.hasMany(orderModel, { foreignKey: "userId" });
orderModel.belongsTo(orderModel, { foreignKey: "userId" });

const PORT = process.env.PORT;

db.sync()
  .then((result) => {
    // console.log(result);

    app.listen(PORT, () => {
      console.log(`Server is listening on  port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
