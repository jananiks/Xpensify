import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../context/SidebarContext";
import { FaPlus, FaMinus } from "react-icons/fa";
import { MdAttachMoney, MdBarChart } from "react-icons/md";
import IncomeModal from "../components/IncomeModal";
import ExpenseModal from "../components/ExpenseModal";
import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

const Income = () => {
  const { isSidebarOpen } = useSidebar();
  const [isIncomeModalOpen, setIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/income/${userEmail}`);
        if (!response.ok) {
          throw new Error("Failed to fetch income data");
        }
        const data = await response.json();
        setIncomeData(data);
      } catch (error) {
        console.error("Error fetching income data:", error);
        setError("Failed to load income data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchIncomeData();
    } else {
      setError("User not logged in. Please log in to view income details.");
      setLoading(false);
    }
  }, [userEmail]);

  // Calculate total income
  const totalIncome = incomeData.reduce((sum, income) => sum + income.amount, 0);

  // Calculate average income
  const avgIncome = incomeData.length > 0 ? (totalIncome / incomeData.length).toFixed(2) : 0;

  // Group income by category
  const incomeByCategory = incomeData.reduce((acc, income) => {
    acc[income.source] = (acc[income.source] || 0) + income.amount;
    return acc;
  }, {});

  // Prepare data for the bar chart (grouped by category)
  const barChartData = {
    labels: Object.keys(incomeByCategory), // Categories
    datasets: [
      {
        label: "Income Amount by Category",
        data: Object.values(incomeByCategory), // Aggregated amounts
        backgroundColor: ["#4CAF50", "#FF9800", "#2196F3", "#FFC107", "#9C27B0"],
        borderColor: "#388E3C",
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for the pie chart (grouped by category)
  const pieChartData = {
    labels: Object.keys(incomeByCategory), // Categories
    datasets: [
      {
        data: Object.values(incomeByCategory), // Aggregated amounts
        backgroundColor: ["#4CAF50", "#FF9800", "#2196F3", "#FFC107", "#9C27B0"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className="p-4"
        style={{
          marginLeft: isSidebarOpen ? "240px" : "80px",
          width: isSidebarOpen ? "calc(100% - 240px)" : "calc(100% - 80px)",
          transition: "margin-left 0.3s ease-in-out, width 0.3s ease-in-out",
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #F4F1DE, #E8E8E8)",
          position: "relative",
        }}
      >
        {/* Header */}
        <h2 className="fw-bold text-center" style={{ color: "#4CAF50" }}>Income Dashboard</h2>

        {/* Error Message */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Loading Spinner */}
        {loading && <div className="text-center py-5">Loading...</div>}

        {/* Cards Section */}
        {!loading && !error && (
          <div className="d-flex flex-wrap gap-4 mt-4 justify-content-center">
            {/* Total Income Card */}
            <div
              className="card shadow"
              style={{
                width: "22rem",
                background: "linear-gradient(135deg, #4CAF50, #81C784)",
                borderRadius: "15px",
                padding: "20px",
                color: "#FFFFFF",
                boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.15)",
              }}
            >
              <MdAttachMoney size={40} />
              <h4 className="card-title fw-bold mt-3">Total Income</h4>
              <p className="card-text" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                ₹{totalIncome.toLocaleString()}
              </p>
            </div>

            {/* Average Income Card */}
            <div
              className="card shadow"
              style={{
                width: "22rem",
                background: "linear-gradient(135deg, #FF9800, #FFC107)",
                borderRadius: "15px",
                padding: "20px",
                color: "#FFFFFF",
                boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.15)",
              }}
            >
              <MdBarChart size={40} />
              <h4 className="card-title fw-bold mt-3">Average Income</h4>
              <p className="card-text" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                ₹{avgIncome.toLocaleString()}
              </p>
            </div>

            {/* Income by Category Card */}
            <div
              className="card shadow"
              style={{
                width: "22rem",
                background: "linear-gradient(135deg, #2196F3, #64B5F6)",
                borderRadius: "15px",
                padding: "20px",
                color: "#FFFFFF",
                boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.15)",
                overflowY: "auto",
                maxHeight: "200px",
              }}
            >
              <h4 className="card-title fw-bold ">Income by Category</h4>

              {/* Filter Box */}
              <div style={{ marginBottom: "15px" }}>
                <label htmlFor="categoryFilter" style={{ fontWeight: "bold", color: "#FFFFFF" }}>
                  Select Category:
                </label>
                <select
                  id="categoryFilter"
                  className="form-select"
                  style={{
                    marginTop: "10px",
                    borderRadius: "5px",
                    padding: "5px",
                    border: "1px solid #ddd",
                    width: "100%",
                  }}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {Object.keys(incomeByCategory).map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Display Total Income for Selected Category */}
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {Object.entries(incomeByCategory)
                  .filter(([category]) => !selectedCategory || category === selectedCategory)
                  .map(([category, amount], index) => (
                    <li key={index} style={{ marginBottom: "10px" }}>
                      <span style={{ fontWeight: "bold" }}>{category}:</span> ₹{amount.toLocaleString()}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}

        {/* Charts Section */}
        {!loading && !error && (
          <div className="mt-3">
            <h2 className="fw-bold text-center" style={{ color: "#4CAF50" }}>Income Overview</h2>
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
                <h4 className="fw-bold text-center" style={{ color: "#4CAF50", marginBottom: "10px" }}>
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
                <h4 className="fw-bold text-center" style={{ color: "#FF9800", marginBottom: "10px" }}>
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
          {/* Add Income Button */}
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

          {/* Add Expense Button */}
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
        <IncomeModal isOpen={isIncomeModalOpen} onClose={() => setIncomeModalOpen(false)} />
        <ExpenseModal isOpen={isExpenseModalOpen} onClose={() => setExpenseModalOpen(false)} />
      </div>
    </div>
  );
};

export default Income;