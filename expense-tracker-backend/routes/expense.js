const express = require("express");
const router = express.Router();
const AddExpense = require("../models/Addexpense"); // ✅ Check the path to the model

router.post("/minus", async (req, res) => {
    try {
      console.log("📩 Received payload in backend:", req.body); // ✅ Log received data
  
      const { email, source, amount, date, notes,time, paymentMethod } = req.body;
  
      if (!email || !source || !amount || !date || !time) {
        return res.status(400).json({ error: "All fields are required!" });
      }
      
      const formattedDate = new Date(date).toISOString().split("T")[0];

      const newExpense = new AddExpense({
        email, // ✅ Ensure email is added
        source,
        amount,
        date: formattedDate,
        time,
        notes,
        paymentMethod,
      });
  
      await newExpense.save();
      console.log("✅ Expense saved in DB:", newExpense); // ✅ Log saved data
  
      res.status(201).json({ message: "Expense added successfully!", expense: newExpense });
    } catch (err) {
      console.error("❌ Error adding Expense:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "Email is required!" });
    }

    const expenseDetails = await AddExpense.find({ email }).sort({ date: -1, time: -1 });

    res.status(200).json(expenseDetails);
  } catch (err) {
    console.error("❌ Error fetching income:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
  
module.exports = router;
