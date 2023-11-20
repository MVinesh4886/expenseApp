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
const generateToken = (
  userId,
  name,
  emailId,
  isPremiumUser,
  isVerified,
  resetPasswordToken
) => {
  const payload = {
    id: userId,
    name,
    emailId,
    isPremiumUser,
    isVerified,
    resetPasswordToken,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: 60 * 60,
  });

  return token;
};

module.exports = generateToken;
