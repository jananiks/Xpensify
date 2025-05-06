import React, { useState } from "react";
import Modal from "react-modal";

const IncomeModal = ({ isOpen, onClose, onIncomeAdded }) => {
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async () => {
    try {
      const incomeData = { source, amount, paymentMethod, date, time, notes };
      await axios.post("http://localhost:5000/api/income", incomeData);
      onIncomeAdded(); // Notify the parent component to refresh
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error adding income:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <h2>Add Income</h2>
      <form>
        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Payment Method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <button type="button" onClick={handleSubmit}>Add Income</button>
      </form>
    </Modal>
  );
};

export default IncomeModal;
