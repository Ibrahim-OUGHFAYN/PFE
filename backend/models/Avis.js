const mongoose = require("mongoose");

const avisSchema = new mongoose.Schema({
  voyageur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // ✅ Must match the name used in User model
    required: true,
  },
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // or "Guide" if guide is in a different collection
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Avis", avisSchema);
