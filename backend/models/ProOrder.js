const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  uid: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  paymentId: { type: String, unique: true, sparse: true },
  expiresAt: Date
}, { timestamps: true });
module.exports = mongoose.model("ProOrder", schema);
