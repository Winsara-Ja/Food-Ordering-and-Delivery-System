const mongoose = require("mongoose");

const DocumentVerificationSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  documentUrl: { type: String, required: true },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  uploadedAt: { type: Date, default: Date.now },
  remarks: { type: String }
});

module.exports = mongoose.model("DocumentVerification", DocumentVerificationSchema);
