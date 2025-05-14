const mongoose = require("mongoose");
require("dotenv").config();

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["voyageur", "guide", "admin"],
    default: "voyageur",
  },
  imgUrl: { type: String, default: process.env.DEFAULT_USER_IMG_URL},

  //for guides
  Langues:{
    type:[String],
    required: function () {
      return this.role === "guide";
    },
  },
  experience: {
    type: Number,
    required: function () {
      return this.role === "guide";
    },
  },
  disponibilites: {
    type: [Date],
    required: function () {
      return this.role === "guide";
    },
  },
  aventures: {
    type: [String],
    required: function () {
      return this.role === "guide";
    },
  },
  ville: {
    type: String,
    required: function () {
      return this.role === "guide";
    },
  },
});

module.exports = mongoose.model("User", userSchema);
