const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    area: { type: Number, required: true }, // hectares
    tonnes: { type: Number, required: true }, // stored CO₂
    owner: { type: String, required: true }, // could be email or wallet
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
