const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");


const clubRoutes = require("./routes/clubRoutes");
dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // important for req.body

// test route
app.get("/", (req, res) => res.send("UniXplore API Running"));

// auth routes (register/login)
app.use("/api/auth/college", require("./routes/collegeRoutes"));

// admin routes (protected)
app.use("/api/admin", require("./routes/adminRoutes"));

// simple debug test that will be proxied by Next.js
app.get("/api/test", (req, res) => res.send("Backend is working!"));

app.use("/api/auth/club", clubRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
