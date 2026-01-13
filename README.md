📊 Household Expense Analyzer

A modern React-based household expense tracking web application that helps users record, analyze, and compare daily and monthly expenses with clean visual analytics.

🚀 Features--

➕ Add, edit, and delete daily expenses
📅 Date-based expense tracking (future dates restricted)
📊 Visual analytics using Bar & Pie Charts
📈 Monthly comparison with percentage change
🔍 Filter expenses by month and year
⚠️ Highlights missing days with no expense entry
🌙 Light / Dark mode toggle
💾 Persistent storage using LocalStorage
📱 Responsive & clean UI design

🛠 Tech Stack--

|---------------------------------------|
|Technology	    |    Purpose            |
|---------------------------------------|
|React.js	    |    Frontend framework | 
|Chart.js	    |    Data visualization |
|React ChartJS 2|	Chart integration   |
|CSS3	        |    Styling & theming  |
|LocalStorage	|    Data persistence   |
|---------------------------------------|         

📸 Screenshots--

/screenshots/dashboard.png
/screenshots/analytics.png
/screenshots/dark-mode.png

📂 Project Structure--
Expense-Tracker/
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── public/
│
├── README.md
└── package.json

⚙️ Installation & Setup--
# Clone the repository
1. git clone https://github.com/your-username/expense-tracker.git

# Navigate to project directory
2. cd expense-tracker

# Install dependencies
3. npm install

# Start the development server
4. npm run dev

📊 How It Works--

1. User selects a date and enters expense details.             
2. Data is validated (no future dates allowed).
3. Expenses are stored locally in the browser.
4. Charts and summaries update automatically.
5. Monthly comparison highlights spending trends.

📌 Limitations--

- Data is stored locally (browser-specific)
- No backend or user authentication (yet)

⭐ If you like this project, give it a star!