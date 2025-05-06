import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaMinus } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import IncomeModal from "../components/IncomeModal";
import ExpenseModal from "../components/ExpenseModal";
import { useSidebar } from "../context/SidebarContext";

import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  const { isSidebarOpen } = useSidebar();

  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isIncomeModalOpen, setIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  const [dashboardIncome, setDashboardIncome] = useState(0);
  const [dashboardExpense, setDashboardExpense] = useState(0);
  const months = [
    { value: "all", label: "-" },
    { value: "January", label: "January" },
    { value: "February", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "7", label: "August" },
    { value: "August", label: "September" },
    { value: "October", label: "October" },
    { value: "November", label: "November" },
    { value: "December", label: "December" },
  ];

  const years = [
    { value: "all", label: "-" },
    ...Array.from({ length: 2025 - 2000 + 1 }, (_, i) => {
      const year = 2025 - i;
      return { value: year.toString(), label: year.toString() };
    }),
  ];
  const [selectedMonth, setSelectedMonth] = useState(months[0].value);
  const [selectedYear, setSelectedYear] = useState(years[0].value);
  const [allMonth, setAllMonth] = useState(true);
  const [incomeByCategory, setincomeByCategory] = useState([]);
  useEffect(() => {
    fetchIncomeData();
    fetchExpenseData();
    fetchTransactions();
  }, []);
  useEffect(() => {
    const updated = transactions.reduce((acc, income) => {
      acc[income.source] = (acc[income.source] || 0) + income.amount;
      return acc;
    }, {});
    setincomeByCategory(updated);
    const totalIncome = transactions.reduce(
      (sum, income) => 
        sum + (income.type === "income" ? income.amount : 0),
      0
    );
    setDashboardIncome(totalIncome)
    const totalExpense = transactions.reduce(
      (sum, expense) => 
        sum + (expense.type === "expense" ? expense.amount : 0),
      0
    );
    const netIncome = totalIncome - totalExpense;
    setDashboardExpense(netIncome)
  }, [transactions]);
  const fetchIncomeData = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      const response = await axios.get(
        `http://localhost:5000/api/income/${userEmail}?month=${selectedMonth}&year=${selectedYear}`
      );
      setIncomeData(response.data);
    } catch (error) {
      console.error("Error fetching income data:", error.message);
    }
  };

  const fetchExpenseData = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      const response = await axios.get(
        `http://localhost:5000/api/expense/${userEmail}?month=${selectedMonth}&year=${selectedYear}`
      );
      setExpenseData(response.data);
    } catch (error) {
      console.error("Error fetching expense data:", error.message);
    }
  };

  const fetchTransactions = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail");
      const response = await axios.get(
        `http://localhost:5000/transactions/${userEmail}`
      );
      //const tranxtion = mockTransactionData;
      localStorage.setItem("transactiondata", JSON.stringify(response.data));
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error.message);
    }
  };

  const handleAddIncome = (newIncome) => {
    axios
      .post("http://localhost:5000/api/income", newIncome)
      .then(() => {
        fetchIncomeData();
        fetchTransactions();
        setIncomeModalOpen(false);
      })
      .catch((error) => console.error("Error adding income:", error.message));
  };

  const handleAddExpense = (newExpense) => {
    axios
      .post("http://localhost:5000/api/expense", newExpense)
      .then(() => {
        fetchExpenseData();
        fetchTransactions();
        setExpenseModalOpen(false);
      })
      .catch((error) => console.error("Error adding expense:", error.message));
  };

  

  const handleTransaction = () => {
    setShowTransaction(true);
    const transaction = JSON.parse(localStorage.getItem("transactiondata"));
    const filteredData = transaction.filter(entry => {
      const entryDate = new Date(entry.date);
      const month = entryDate.toLocaleString('default', { month: 'long' });
      const year = entryDate.getFullYear().toString();

      if(selectedMonth == "all" && selectedYear != "all"){
        return  year === selectedYear;
      }else if(selectedMonth == "all" && selectedYear == "all"){
        return transaction;
      }else if(selectedMonth != "all" && selectedYear == "all"){
        return month === selectedMonth;
      }else{
        return month === selectedMonth && year === selectedYear;
      }
     
    });

    // let filtered = [];
    // if (allMonth) {
    //   filtered = transaction.filter(
    //     (data) => new Date(data.date).getFullYear() === selectedYear
    //   );
    // } else {
    //   filtered = transaction.filter(
    //     (data) =>
    //       new Date(data.date).getFullYear() === selectedYear &&
    //       new Date(data.date).getMonth() + 1 === selectedMonth
    //   );
    // }
    setTransactions(filteredData);
  };
  const barChartData = {
    labels: Object.keys(incomeByCategory), // Categories
    datasets: [
      {
        label: "Income Amount by Category",
        data: Object.values(incomeByCategory), // Aggregated amounts
        backgroundColor: [
          "#4CAF50",
          "#FF9800",
          "#2196F3",
          "#FFC107",
          "#9C27B0",
        ],
        borderColor: "#388E3C",
        borderWidth: 1,
      },
    ],
  };
  const handleIncomeAdded = () => {
    alert("Income added successfully!");
    window.location.reload(); // or re-fetch data if you'd prefer
  };

  // Prepare data for the pie chart (grouped by category)
  const pieChartData = {
    labels: Object.keys(incomeByCategory), // Categories
    datasets: [
      {
        data: Object.values(incomeByCategory), // Aggregated amounts
        backgroundColor: [
          "#4CAF50",
          "#FF9800",
          "#2196F3",
          "#FFC107",
          "#9C27B0",
        ],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div
        className="p-4"
        style={{
          marginLeft: isSidebarOpen ? "240px" : "80px",
          width: isSidebarOpen ? "calc(100% - 240px)" : "calc(100% - 80px)",
          transition: "margin-left 0.3s ease-in-out",
          background: "#F4F1DE",
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <h2>Dashboard</h2>
        <p>Welcome to your expense tracker dashboard!</p>

        <div
          className="d-flex justify-content-between"
          style={{ gap: "20px", marginBottom: "40px" }}
        >
          <div
            className="card shadow-sm p-4"
            style={{
              flex: 1,
              backgroundColor: "#DFF5E1",
              borderRadius: "10px",
              color: "#2E7D32",
              fontWeight: "bold",
              minHeight: "180px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h5>Total Income</h5>
            <p style={{ fontSize: "2rem", margin: 0 }}>
              ₹{dashboardIncome.toLocaleString()}
            </p>
          </div>

          <div
            className="card shadow-sm p-4"
            style={{
              flex: 1,
              backgroundColor: "#FFEBEE",
              borderRadius: "10px",
              color: "#D32F2F",
              fontWeight: "bold",
              minHeight: "180px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h5>Net Income</h5>
            <p style={{ fontSize: "2rem", margin: 0 }}>
              ₹{dashboardExpense.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="filter-section" style={{ marginTop: "40px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center", // Center the dropdowns
              gap: "20px", // Ensure the dropdowns have space between them
              marginBottom: "20px",
            }}
          >
            <div>
              <label
                htmlFor="month"
                style={{ display: "block", marginBottom: "8px" }}
              >
                Select Month
              </label>
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  backgroundColor: "#fff", // White background for the dropdown
                  color: "#000", // Black text for readability
                  border: "1px solid #ccc", // Light border to match design
                }}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="year"
                style={{ display: "block", marginBottom: "8px" }}
              >
                Select Year
              </label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  backgroundColor: "#fff", // White background for the dropdown
                  color: "#000", // Black text for readability
                  border: "1px solid #ccc", // Light border to match design
                }}
              >
                {years.map((year) => (
                  <option key={year.value} value={year.value}>
                    {year.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={handleTransaction}
              style={{
                padding: "10px",
                fontSize: "1rem",
                backgroundColor: "#A3D8D5",
                color: "#fff",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontWeight: "bold",
                width: "180px",
                height: "50px",
              }}
            >
              Show Transactions
            </button>
          </div>
        </div>

        {showTransaction && (
          <div style={{ marginTop: "40px" }}>
            <h4>Transactions</h4>
            {transactions.length > 0 ? (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={index}>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>{transaction.description}</td>
                      <td>₹{transaction.amount.toLocaleString()}</td>
                      <td>{transaction.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No transactions available for this period.</p>
            )}
          </div>
        )}

        {/* Floating Buttons */}
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            zIndex: "1000",
          }}
        >
          {/* Add Income */}
          <button
            className="btn btn-lg rounded-circle shadow"
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#A3D8D5",
              color: "#3A506B",
              border: "none",
              fontSize: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.15)",
              transition: "transform 0.3s",
            }}
            onClick={() => setIncomeModalOpen(true)}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            <FaPlus />
          </button>

          {/* Add Expense */}
          <button
            className="btn btn-lg rounded-circle shadow"
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#F1C6B1",
              color: "#3A506B",
              border: "none",
              fontSize: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.15)",
              transition: "transform 0.3s",
            }}
            onClick={() => setExpenseModalOpen(true)}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          >
            <FaMinus />
          </button>
        </div>

        {/* Modals */}
        <IncomeModal
          isOpen={isIncomeModalOpen}
          onClose={() => setIncomeModalOpen(false)}
          onAddIncome={handleAddIncome}
        />
        <ExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => setExpenseModalOpen(false)}
          onAddExpense={handleAddExpense}
        />
        <div className="mt-3">
          <h2 className="fw-bold text-center" style={{ color: "#4CAF50" }}>
            Income Overview
          </h2>
          <div className="d-flex flex-wrap gap-4 mt-4 justify-content-center">
            {/* Bar Chart */}
            <div
              style={{
                width: "45%",
                height: "400px",
                backgroundColor: "#FFFFFF",
                borderRadius: "15px",
                padding: "20px",
                boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.15)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h4
                className="fw-bold text-center"
                style={{ color: "#4CAF50", marginBottom: "10px" }}
              >
                Income by Category
              </h4>
              <Bar
                data={barChartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                      position: "top",
                      labels: {
                        font: {
                          size: 12,
                        },
                      },
                    },
                  },
                }}
              />
            </div>

            {/* Pie Chart */}
            <div
              style={{
                width: "45%",
                height: "400px",
                backgroundColor: "#FFFFFF",
                borderRadius: "15px",
                padding: "20px",
                boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.15)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <h4
                className="fw-bold text-center"
                style={{ color: "#FF9800", marginBottom: "10px" }}
              >
                Income Distribution
              </h4>
              <Pie
                data={pieChartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: true,
                      position: "bottom",
                      labels: {
                        font: {
                          size: 12,
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
