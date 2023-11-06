const Sequelize = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const expenseModel = db.define("expense", {
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
    allowNull: false,
  },
});

module.exports = expenseModel;
