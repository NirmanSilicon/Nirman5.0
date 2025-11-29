const mongoose = require("mongoose");

const CollegeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },   // 🔥 REQUIRED
    collegeId: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("College", CollegeSchema);