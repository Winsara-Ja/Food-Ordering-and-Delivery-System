const DocumentVerification = require("../models/DocumentVerification");
const Restaurant = require("../models/Restaurant");

exports.uploadDocument = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user.id });
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const doc = new DocumentVerification({
      restaurant: restaurant._id,
      documentUrl: `/uploads/documents/${req.file.filename}`
    });

    await doc.save();
    res.status(201).json({ message: "Document uploaded for verification", doc });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const documents = await DocumentVerification.find().populate("restaurant", "name email");
    res.json({ documents });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch documents", error: err.message });
  }
};

exports.approveDocument = async (req, res) => {
  try {
    const doc = await DocumentVerification.findById(req.params.id);
    doc.status = "approved";
    await doc.save();
    res.json({ message: "Document approved", doc });
  } catch (err) {
    res.status(500).json({ message: "Approval failed", error: err.message });
  }
};

exports.rejectDocument = async (req, res) => {
  try {
    const doc = await DocumentVerification.findById(req.params.id);
    doc.status = "rejected";
    doc.remarks = req.body.remarks || "";
    await doc.save();
    res.json({ message: "Document rejected", doc });
  } catch (err) {
    res.status(500).json({ message: "Rejection failed", error: err.message });
  }
};
