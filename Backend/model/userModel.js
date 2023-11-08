const Sequelize = require("sequelize");
const db = require("../config/database");

const { DataTypes } = Sequelize;

const userModel = db.define("user", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emailId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isPremiumUser: DataTypes.BOOLEAN,
});

// userModel.associate = (models) => {
//   userModel.hasMany(models.expenseModel, {
//     foreignKey: {
//       name: "userId",
//       allowNull: false,
//     },
//     onDelete: "cascade",
//   });

//   userModel.hasMany(models.orderModel, {
//     foreignKey: {
//       name: "userId",
//       allowNull: false,
//     },
//     onDelete: "cascade",
//   });
// };

module.exports = userModel;
