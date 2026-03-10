const Complaint = require('../models/Complaint');

// @desc    Submit a complaint
// @route   POST /api/complaints
// @access  Private (User)
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      user: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Complaint submitted successfully', complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all complaints for logged-in user
// @route   GET /api/complaints
// @access  Private (User)
exports.getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: complaints.length, complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single complaint by ID (user's own)
// @route   GET /api/complaints/:id
// @access  Private (User)
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ _id: req.params.id, user: req.user._id });
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    res.json({ success: true, complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};