const Sequelize = require("sequelize");
const db = require("../config/database");

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
});

module.exports = expenseModel;
