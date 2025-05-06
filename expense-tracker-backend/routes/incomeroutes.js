// backend/routes/incomeRoutes.js
const express = require("express");
const router = express.Router();
const Income = require("../models/Income");

// POST request to add new income
router.post("/income", async (req, res) => {
  try {
    const { amount, description, date } = req.body;

    // Assuming req.userEmail is populated from a middleware (authentication)
    const newIncome = new Income({
      amount,
      description,
      date,
      userEmail: req.userEmail,  // Add user email or other necessary info
    });

    await newIncome.save();
    res.status(200).json(newIncome);  // Send back the added income as confirmation
  } catch (error) {
    console.error("Error adding income:", error);
    res.status(500).json({ message: "Error adding income" });
  }
});

module.exports = router;
