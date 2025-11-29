const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/colleges", require("./routes/collegeRoutes.js"));
app.use("/api/clubs", require("./routes/clubRoutes.js"));
app.use("/api/public", require("./routes/publicRoutes.js"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


