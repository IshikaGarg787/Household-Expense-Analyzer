import { useState, useEffect } from "react";
import "./App.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);


function App() {

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  const [isLoaded, setIsLoaded] = useState(false);

  // ---------- TODAY ----------
  const today = new Date();

  // ---------- STATES ----------
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  const [expenses, setExpenses] = useState([]);
  const [editId, setEditId] = useState(null);

  // ---------- Month & Year Filtering ----------
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Generate dynamic year options (±5 years)
  const years = Array.from({ length: 11 }, (_, i) => today.getFullYear() - 5 + i);

  // ---------- LOAD FROM LOCALSTORAGE ----------
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    setIsLoaded(true);
  }, []);


  // ---------- SAVE TO LOCALSTORAGE ----------
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("expenses", JSON.stringify(expenses));
    }
  }, [expenses, isLoaded]);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);


  // ---------- ADD / UPDATE EXPENSE ----------
  const handleAddExpense = () => {
    if (!amount || !category || !date) {
      alert("Please fill all required fields");
      return;
    }

    const todayString = new Date().toISOString().split("T")[0];

    if (date > todayString) {
      alert("You cannot add expenses for future dates");
      return;
    }



    if (editId) {
      // UPDATE EXISTING EXPENSE
      setExpenses(
        expenses.map((exp) =>
          exp.id === editId
            ? {
              ...exp,
              amount: Number(amount),
              category,
              date,
              note,
            }
            : exp
        )
      );
      setEditId(null);
    } else {
      // ADD NEW EXPENSE
      const newExpense = {
        id: Date.now(),
        amount: Number(amount),
        category,
        date,
        note,
      };

      setExpenses([...expenses, newExpense]);
    }

    // CLEAR FORM
    setAmount("");
    setCategory("");
    setDate("");
    setNote("");
  };

  // ---------- DELETE ----------
  const handleDelete = (id) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  // ---------- EDIT ----------
  const handleEdit = (expense) => {
    setAmount(expense.amount);
    setCategory(expense.category);
    setDate(expense.date);
    setNote(expense.note);
    setEditId(expense.id);
  };

  // ---------- FILTER EXPENSES BY MONTH & YEAR ----------
  const filteredExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    return (
      expDate.getMonth() + 1 === Number(selectedMonth) &&
      expDate.getFullYear() === Number(selectedYear)
    );
  });

  // ---------- CALCULATIONS USING FILTERED EXPENSES ----------
  const totalExpense = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryTotals = filteredExpenses.reduce((result, exp) => {
    if (!result[exp.category]) result[exp.category] = 0;
    result[exp.category] += exp.amount;
    return result;
  }, {});

  const dailyTotals = filteredExpenses.reduce((result, exp) => {
    if (!result[exp.date]) result[exp.date] = 0;
    result[exp.date] += exp.amount;
    return result;
  }, {});

  // ---------- MONTHLY COMPARISON ----------

  // Current month total (already filtered)
  const currentMonthTotal = totalExpense;

  // Find previous month & year
  let prevMonth = selectedMonth - 1;
  let prevYear = selectedYear;

  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear = selectedYear - 1;
  }

  // Filter previous month expenses
  const previousMonthExpenses = expenses.filter((exp) => {
    const expDate = new Date(exp.date);
    return (
      expDate.getMonth() + 1 === prevMonth &&
      expDate.getFullYear() === prevYear
    );
  });

  // Previous month total
  const previousMonthTotal = previousMonthExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  // Difference
  const difference = currentMonthTotal - previousMonthTotal;

  // Percentage change
  const percentageChange =
    previousMonthTotal === 0
      ? 0
      : ((difference / previousMonthTotal) * 100).toFixed(1);


  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
        ],
      },
    ],
  };



  const barData = {
    labels: Object.keys(dailyTotals),
    datasets: [
      {
        label: "Daily Expense (₹)",
        data: Object.values(dailyTotals),
        backgroundColor: "rgba(60, 176, 253, 0.6)",
      },
    ],
  };

  const comparisonBarData = {
    labels: ["Previous Month", "Current Month"],
    datasets: [
      {
        label: "Expense Comparison (₹)",
        data: [previousMonthTotal, currentMonthTotal],
        backgroundColor: ["#f97316", "#22c55e"],
      },
    ],
  };



  // Number of days in selected month
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

  // Array of all dates in month
  const allDates = Array.from({ length: daysInMonth }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");
    const month = String(selectedMonth).padStart(2, "0");
    return `${selectedYear}-${month}-${day}`;
  });

  const isFutureMonth =
    selectedYear > today.getFullYear() ||
    (selectedYear === today.getFullYear() && selectedMonth > today.getMonth() + 1);

  // Missing days
  const todayString = today.toISOString().split("T")[0];

  let missingDays = [];

  if (!isFutureMonth) {
    missingDays = allDates.filter(
      (d) => d <= todayString && !dailyTotals[d]
    );
  }

  // ---------- HANDLERS FOR MONTH/YEAR CHANGE ----------
  const handleMonthChange = (e) => {
    const month = Number(e.target.value);
    setSelectedMonth(month);
    // Update date input to first day of selected month
    const day = 1;
    setDate(`${selectedYear}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  };

  const handleYearChange = (e) => {
    const year = Number(e.target.value);
    setSelectedYear(year);
    // Update date input to first day of selected month/year
    const day = 1;
    setDate(`${year}-${String(selectedMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  };

  // ---------- UI ----------
  return (
    <div className="app">
      <h1>Household Expense Analyzer</h1>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"} Mode
        </button>
      </div>


      <div className="top-section">
        {/* MONTH & YEAR FILTER */}
        <div className="card">
          <h2>Select Month & Year</h2>

          <label>
            Month:
            <select value={selectedMonth} onChange={handleMonthChange}>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </label>

          <label style={{ marginLeft: "15px" }}>
            Year:
            <select value={selectedYear} onChange={handleYearChange}>
              {years.map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </label>
        </div>


        {/* INPUT FORM */}
        <div className="card">
          <h2>Add Expense</h2>

          <div className="form-row">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Category</option>
              <option value="Food">Food</option>
              <option value="Rent">Rent</option>
              <option value="Travel">Travel</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="date"
              max={today.toISOString().split("T")[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <input
              type="text"
              placeholder="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <button onClick={handleAddExpense}>
              {editId ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>

      <div className="middle-section">

        {/* EXPENSE LIST */}
        <div className="card">
          <h2>Expense List</h2>

          {filteredExpenses.length === 0 && (
            <p>No expenses added for this month.</p>
          )}

          <ul>
            {filteredExpenses.map((exp) => (
              <li key={exp.id}>
                <span>
                  ₹{exp.amount} | {exp.category} | {exp.date}
                </span>

                <span>
                  <button onClick={() => handleEdit(exp)}>Edit</button>
                  <button onClick={() => handleDelete(exp.id)}>Delete</button>
                </span>
              </li>
            ))}
          </ul>
        </div>


        {/* SUMMARY */}
        <div className="card summary-card">
          <h2>Summary</h2>

          <p><b>Total Expense:</b> ₹{totalExpense}</p>
          <p><b>Categories Used:</b> {Object.keys(categoryTotals).length}</p>

          <h3>Missing Days</h3>

          {isFutureMonth ? (
            <p>Missing days will be available after this month starts.</p>
          ) : missingDays.length === 0 ? (
            <p>All past days have expenses entered!</p>
          ) : (
            <ul>
              {missingDays.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          )}
        </div>

      </div>
      <div className="card comparison-card">
        <h3>Monthly Comparison</h3>

        <div className="comparison-boxes">
          <div className="stat-box">
            <span>This Month</span>
            <strong>₹{currentMonthTotal}</strong>
          </div>

          <div className="stat-box">
            <span>Last Month</span>
            <strong>₹{previousMonthTotal}</strong>
          </div>

          <div className={`stat-box highlight ${difference >= 0 ? "up" : "down"}`}>
            <span>Change</span>
            <strong>
              {difference >= 0 ? "▲" : "▼"} ₹{Math.abs(difference)}
            </strong>
            <small>{percentageChange}%</small>
          </div>
        </div>
      </div>



      <h2>Analytics</h2>
      <div className="analytics-section">
        <div className="card chart-card">
          {Object.keys(dailyTotals).length > 0 && (
            <>
              <h3>Daily Expense</h3>
              <Bar data={barData} />
            </>
          )}
        </div>
        <div className="card chart-card">

          {Object.keys(categoryTotals).length > 0 && (
            <>
              <h3>Category-wise Expense</h3>
              <Pie data={pieData} />
            </>
          )}
        </div>
        <div className="card chart-card">
          <h3>Monthly Expense Comparison</h3>
          <Bar data={comparisonBarData} />
        </div>



      </div>

    </div>
  );
}

export default App;
