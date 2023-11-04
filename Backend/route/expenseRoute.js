const express = require("express");
const expenseModel = require("../model/expenseModel");
const expenseRouter = express.Router();

expenseRouter.post("/expense/create", async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const userId = req.user.id;
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
    const tracker = await expenseModel.findByPk(req.params.id);
    if (!tracker) {
      return res.status(404).json({ message: "tracker not found" });
    }
    res.status(200).json({
      success: true,
      data: tracker,
    });
  } catch (error) {
    res.status(400).json({ message: "Internal server error" });
  }
});

expenseRouter.put("/expense/put/:id", async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const updatedTracker = await expenseModel.update(
      { amount, description, category },
      { where: { id: req.params.id } }
    );
    if (updatedTracker[0] === 0) {
      return res.status(500).json({ message: "tracker not found" });
    }
    const tracker = await expenseModel.findByPk(req.params.id);
    res.status(200).json({
      success: true,
      data: tracker,
    });
  } catch (error) {
    console.log(error);
    res.status(501).json({ message: "internal server error" });
  }
});

expenseRouter.delete("/expense/delete/:id", async (req, res) => {
  try {
    const deletedTracker = await expenseModel.destroy({
      where: { id: req.params.id },
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
