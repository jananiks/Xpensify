const mongoose = require("mongoose");

// Define the Income Schema
const IncomeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true, // Who added the income
  },
  source: {
    type: String,
    required: true, // Where income came from (e.g., Salary, Freelance)
    trim: true
  },
  amount: {
    type: Number,
    required: true, // How much income
    min: [0, "Amount cannot be negative"]
  },
  paymentMethod: {
    type: String,
    required: true, // Payment method (e.g., Cash, Bank Transfer)
    trim: true
  },
  date: {
    type: Date,
    required: true, // Exact date of income
  },
  time: {
    type: String,
    required: true, // Time (optional better: use Date instead of String but keeping yours)
    trim: true
  },
  notes: {
    type: String,
    trim: true // Optional extra info
  }
}, {
  timestamps: true // Auto add createdAt and updatedAt
});

// Export the model
const IncomeModel = mongoose.model("Income", IncomeSchema);

module.exports = IncomeModel;
