// models/Package.js
const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: { type: Number, required: true },
  purchasedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Package", packageSchema);
