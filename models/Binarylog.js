const { default: mongoose } = require("mongoose");

const binaryLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: Date, required: true },
  pairsMatched: Number,
  amount: Number,
  carryLeft: Number,
  carryRight: Number,
});
module.exports = mongoose.model("BinaryLog", binaryLogSchema);
