const bcrypt = require("bcryptjs");
const User = require("../models/User");
const DashboardAccessRequest = require("../models/DashboardAccessRequest");

// Create request
exports.requestDashboardAccess = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const existingRequest = await DashboardAccessRequest.findOne({ email });
    if (existingRequest) return res.status(400).json({ message: "Request already submitted" });

    const newRequest = new DashboardAccessRequest({ email, password });
    await newRequest.save();

    res.status(201).json({ message: "Dashboard access request submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all requests
exports.getAllDashboardRequests = async (req, res) => {
  try {
    const requests = await DashboardAccessRequest.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error });
  }
};

// Approve/Reject request
exports.updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const updated = await DashboardAccessRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Request not found" });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating status", error });
  }
};

// Controller to get the count of pending dashboard access requests
exports.getPendingDashboardAccessRequests = async (req, res) => {
  try {
    // Count the number of pending requests
    const pendingCount = await DashboardAccessRequest.countDocuments({ status: "pending" });

    // Send the count to the client
    return res.status(200).json({ pendingRequests: pendingCount });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

