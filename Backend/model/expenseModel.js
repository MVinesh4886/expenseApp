const Sequelize = require("sequelize");
const db = require("../config/database");
const userModel = require("./userModel");

const { DataTypes } = Sequelize;

const expenseModel = db.define("expense-tracker", {
  amount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    enum: ["Food", "Electricity", "Fuel", "Recharge"],
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: userModel,
      key: "id",
    },
  },
});

module.exports = expenseModel;
