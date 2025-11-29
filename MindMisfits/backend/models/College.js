const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
    collegeId: {
        type: String,
        unique: true,
        required: true
    },
    name: String,
    city: String,
    state: String,
    location: String,
    officialWebsite: String,

    officialEmail: {
        type: String,
        required: true,
        unique: true
    },

    admin: {
        email: { type: String, required: true },
        password: { type: String, required: true } // hashed
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("College", collegeSchema);
