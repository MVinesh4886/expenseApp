//2. verify token

const jwt = require("jsonwebtoken");
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    // console.log(decoded);
    if (err) {
      return false;
    }
    return decoded;
  });
};

module.exports = verifyToken;

//const decodedmodelName = verifyToken(token)
