//get Token from headers
const getToken = (req) => {
  const headerObj = req.headers;
  const token = headerObj["authorization"].split(" ")[1];
  //if there is token, return token
  if (token !== undefined) {
    return token;
  }
  return {
    status: "failed",
    message: "There is no token attached to the headers",
  };
};

module.exports = getToken;

// const token = getToken(req);
