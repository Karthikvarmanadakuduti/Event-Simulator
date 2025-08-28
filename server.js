const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MySQL connection (use WAMP details)
const db = mysql.createConnection({
  host: "localhost",
  user: "root",         // your phpMyAdmin username
  password: "",         // your phpMyAdmin password (default is empty in WAMP)
  database: "buttonsdb"
});

// ✅ connect to DB
db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
    process.exit(1);
  }
  console.log("✅ MySQL connected...");
});

// ✅ API to store button event
app.post("/event", (req, res) => {
  const { ch_no, status } = req.body;
  console.log("Button Clicked:", ch_no, "Status:", status);

  const query = "INSERT INTO events (ch_no, status) VALUES (?, ?)";
  db.query(query, [ch_no, status], (err, result) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json({ message: "Event stored", id: result.insertId });
  });
});

// ✅ API to fetch events (for testing)
app.get("/events", (req, res) => {
  db.query("SELECT * FROM events ORDER BY s_no DESC", (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(rows);
  });
});

// Start server
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
