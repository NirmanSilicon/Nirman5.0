const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
    clubId: { type: String, unique: true, required: true },
    collegeId: { type: String, required: true },  // CLG-XXXXX
    name: { type: String, required: true },
    email: { type: String, required: true },       // club email
    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true },
    passwordHash: { type: String, required: true },
    categoryId: { type: Number, required: true },  // matches frontend
    description: { type: String, required: true },
    approved: { type: Boolean, default: false },   // college admin must approve
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Club", clubSchema);
