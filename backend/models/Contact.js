const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
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

// Add an index for better query performance
contactSchema.index({ sender: 1, receiver: 1, dateEnvoi: -1 });

module.exports = mongoose.model("Contact", contactSchema);