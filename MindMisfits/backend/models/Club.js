
const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema({
    clubId: { type: String, required: true, unique: true },

    name: { type: String, required: true },   // <-- matches "name"
    email: { type: String, required: true },  // <-- matches "email"

    collegeId: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },

    adminName: { type: String, required: true },
    adminEmail: { type: String, required: true },

    password: { type: String, required: true }
});

module.exports = mongoose.model("Club", clubSchema);
