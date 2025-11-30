require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

const app = express();

// Connect to database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json()); // parse JSON bodies

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));

// Simple test route
app.get("/", (req, res) => {
  res.send("Blue Carbon Backend is running ✅");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
