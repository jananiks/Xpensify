const mongoose = require("mongoose");

// Define the Expense Schema
const ExpenseSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true, // Who made the expense
  },
  source: {
    type: String,
    required: true, // Where expense was made (e.g., Food, Travel)
    trim: true
  },
  amount: {
    type: Number,
    required: true, // How much was spent
    min: [0, "Amount cannot be negative"]
  },
  paymentMethod: {
    type: String,
    required: true, // Payment method (e.g., Cash, Card)
    trim: true
  },
  date: {
    type: Date,
    required: true, // Exact date of expense
  },
  time: {
    type: String,
    required: true, // Time (optional: better to use full Date-Time in future)
    trim: true
  },
  notes: {
    type: String,
    trim: true // Extra info about expense
  }
}, {
  timestamps: true // Automatically manage createdAt and updatedAt
});

// Export the model
const ExpenseModel = mongoose.model("Expense", ExpenseSchema);

module.exports = ExpenseModel;
