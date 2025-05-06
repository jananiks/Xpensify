const mongoose = require("mongoose");

const AddIncomeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  source: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // Adjust as needed
  notes: { type: String },
  paymentMethod: { type: String }, // Cash, Credit, etc.
});

module.exports = mongoose.model("AddIncome", AddIncomeSchema);
