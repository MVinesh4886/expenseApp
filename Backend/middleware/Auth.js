const getToken = require("../utils/getToken");
const verifyToken = require("../utils/verifyToken");

const isLogin = (req, res, next) => {
  //1.get Token from headers
  const token = getToken(req);
  //2.verify Token
  const decodedUser = verifyToken(token);
  console.log(decodedUser);
  // if there is no decoded user then
  if (!decodedUser) {
    return res.json({
      message: "Invalid token or token expired",
    });
  }

  //3. save the user into req obj
  req.body.userId = decodedUser.id;
  next();
};

module.exports = isLogin;
