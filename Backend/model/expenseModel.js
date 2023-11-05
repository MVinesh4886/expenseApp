const Sequelize = require("sequelize");
const db = require("../config/database");
const userModel = require("./userModel");

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

expenseModel.associate = (models) => {
  expenseModel.belongsTo(models.userModel, {
    foreignKey: {
      name: "userId",
      allowNull: false,
    },
    onDelete: "cascade",
  });
};

module.exports = expenseModel;
