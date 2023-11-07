const Sequelize = require("sequelize");

const db = new Sequelize(
  "expensetrackerapp",
  "root",
  process.env.PASSWORD_KEY,
  {
    host: "localhost",
    dialect: "mysql",
  }
);

(async () => {
  try {
    await db.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = db;
