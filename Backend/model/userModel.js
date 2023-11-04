const Sequelize = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const userModel = db.define("user", {
  name: DataTypes.STRING,
  emailId: DataTypes.STRING,
  password: DataTypes.STRING,
});

module.exports = userModel;
