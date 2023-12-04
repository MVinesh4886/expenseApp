const Sequelize = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const orderModel = db.define("order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  paymentId: DataTypes.STRING,
  orderId: DataTypes.STRING,
  status: DataTypes.STRING,
});

module.exports = orderModel;
