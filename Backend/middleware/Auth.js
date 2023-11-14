const getToken = require("../utils/getToken");
const verifyToken = require("../utils/verifyToken");

const isLogin = (req, res, next) => {
  //1.get Token from headers
  const token = getToken(req);
  //2.verify Token
  const decodedUser = verifyToken(token);

  // if there is no decoded user then
  if (!decodedUser) {
    return res.json({
      message: "Invalid token or token expired",
    });
  }

  //3. save the user into req obj
  req.body.userId = decodedUser.id;
  req.body.isPremiumUser = decodedUser.isPremiumUser;
  req.body.name = decodedUser.name;
  req.body.emailId = decodedUser.emailId;
  next();
};

module.exports = isLogin;
