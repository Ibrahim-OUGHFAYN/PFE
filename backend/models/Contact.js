const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  voyageur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  guide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  dateEnvoi: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Contact", contactSchema);