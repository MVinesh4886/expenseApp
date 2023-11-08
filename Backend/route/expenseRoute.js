const express = require("express");
const expenseModel = require("../model/expenseModel");
const isLogin = require("../middleware/Auth");

const expenseRouter = express.Router();

expenseRouter.post("/expense/create", isLogin, async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const userId = req.body.userId; // Assuming the userId is passed as a parameter
    const newTracker = await expenseModel.create({
      amount,
      description,
      category,
      userId,
    });
    console.log(newTracker);
    res.status(200).json({
      success: true,
      data: newTracker,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal server error" });
  }
});

expenseRouter.get("/expense/get", async (req, res) => {
  try {
    const gettracker = await expenseModel.findAll();
    res.status(200).json({
      success: true,
      data: gettracker,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal server error" });
  }
});

expenseRouter.get("/expense/getSingle/:id", async (req, res) => {
  try {
    const userId = req.body.userId;
    const tracker = await expenseModel.findAll({ where: { userId: userId } });
    if (!tracker) {
      return res.status(404).json({ message: "tracker not found" });
    }
    res.json(tracker);
  } catch (error) {
    res.status(400).json({ message: "Internal server error" });
  }
});

expenseRouter.put("/expense/put/:id", isLogin, async (req, res) => {
  try {
    const findExpense = await expenseModel.findByPk(req.params.id);
    if (!findExpense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }
    const { amount, description, category } = req.body;
    await expenseModel.update(
      { amount, description, category },
      {
        where: { id: req.params.id },
      }
    );
    const updatedExpense = await expenseModel.findByPk(req.params.id);
    return res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

expenseRouter.delete("/expense/delete/:id", isLogin, async (req, res) => {
  try {
    const deletedTracker = await expenseModel.destroy({
      where: { id: req.params.id, userId: req.body.userId },
    });
    if (deletedTracker === 0) {
      return res.status(500).json({ message: "tracker not found" });
    }
    res.status(200).json({
      success: true,
      data: "tracker has been deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({ message: "internal server error" });
  }
});

module.exports = expenseRouter;
