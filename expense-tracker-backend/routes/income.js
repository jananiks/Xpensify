const express = require("express");
const router = express.Router();
const AddIncome = require("../models/Addincome");

// ✅ Add new income
router.post("/add", async (req, res) => {
  try {
    const { email, source, amount, date, notes, time, paymentMethod } = req.body;

    if (!email || !source || !amount || !date || !time) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const formattedDate = new Date(date).toISOString().split("T")[0]; // Formats the date to YYYY-MM-DD

    const newIncome = new AddIncome({
      email,
      source,
      amount,
      date: formattedDate,
      time,
      notes,
      paymentMethod,
    });

    await newIncome.save();
    res.status(201).json({ message: "Income added successfully!", income: newIncome });
  } catch (err) {
    console.error("❌ Error adding income:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get income for a specific user
router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "Email is required!" });
    }

    // Fetch the income records for the specified user, sorted by date and time
    const incomeDetails = await AddIncome.find({ email }).sort({ date: -1, time: -1 });

    res.status(200).json(incomeDetails);
  } catch (err) {
    console.error("❌ Error fetching income:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get total income for the user (to display on charts)
router.get("/total/:email", async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "Email is required!" });
    }

    const totalIncome = await AddIncome.aggregate([
      { $match: { email } },
      { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
    ]);

    res.status(200).json({ totalIncome: totalIncome[0]?.totalAmount || 0 });
  } catch (err) {
    console.error("❌ Error fetching total income:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
