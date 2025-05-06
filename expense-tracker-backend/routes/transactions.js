const express = require("express");
const router = express.Router();
const IncomeModel = require("../models/Addincome");
const ExpenseModel = require("../models/Addexpense");

// ✅ Route to fetch ALL transactions (income & expense) for a specific user
router.get("/:email", async (req, res) => {
    try {
        const { email } = req.params; // cleaner way
        if (!email) {
            return res.status(400).json({ error: "Email is required!" });
        }

        // ✅ Fetch income and expenses for the user
        const incomes = await IncomeModel.find({ email }).lean();
        const expenses = await ExpenseModel.find({ email }).lean();

        // ✅ Add 'type' field to each transaction
        const incomeTransactions = incomes.map(income => ({
            ...income,
            type: 'income'
        }));

        const expenseTransactions = expenses.map(expense => ({
            ...expense,
            type: 'expense'
        }));

        // ✅ Merge both incomes and expenses
        const allTransactions = [...incomeTransactions, ...expenseTransactions];

        // ✅ Sort by date + time (newest first)
        allTransactions.sort((a, b) => {
            const dateTimeA = new Date(`${a.date}T${a.time}`);
            const dateTimeB = new Date(`${b.date}T${b.time}`);
            return dateTimeB - dateTimeA; // newest first
        });

        res.status(200).json(allTransactions);
    } catch (err) {
        console.error("❌ Error fetching transactions:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
