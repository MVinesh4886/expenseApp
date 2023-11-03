const Sequelize = require("sequelize");
const db = require("../config/database");

const userModel = db.define("user", {
  name: Sequelize.STRING,
  emailId: Sequelize.STRING,
  password: Sequelize.STRING,
});

module.exports = userModel;
