// const jwt = require("jsonwebtoken");

// const generateToken = (id, isPremiumUser, name, emailId) => {
//   return jwt.sign(
//     { id, name, emailId, isPremiumUser },
//     process.env.JWT_SECRET_KEY
//   );
// };

// module.exports = generateToken;

// this is another way to generate
const jwt = require("jsonwebtoken");
const generateToken = (userId, name, emailId, isPremiumUser) => {
  const payload = {
    id: userId,
    name,
    emailId,
    isPremiumUser,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "30d",
  });

  return token;
};

module.exports = generateToken;
