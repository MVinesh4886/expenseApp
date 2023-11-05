const authMiddleware = async (req, res, next) => {
  const userId = req.headers["user-id"];
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const existingUser = await expenseModel.findOne({ where: { userId } });
  if (!existingUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};

module.exports = authMiddleware;
