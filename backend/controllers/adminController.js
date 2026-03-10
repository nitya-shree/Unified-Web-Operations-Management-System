const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @desc    Get all complaints (admin)
// @route   GET /api/admin/complaints
// @access  Private (Admin)
exports.getAllComplaints = async (req, res) => {
  try {
    const { status, category, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, total, page: parseInt(page), complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update complaint status and optional admin note
// @route   PUT /api/admin/complaints/:id
// @access  Private (Admin)
exports.updateComplaint = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const validStatuses = ['Pending', 'In Progress', 'Resolved'];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(adminNote !== undefined && { adminNote }) },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.json({ success: true, message: 'Complaint updated', complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/admin/complaints/:id
// @access  Private (Admin)
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    res.json({ success: true, message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const [total, pending, inProgress, resolved, totalUsers, byCategory] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'Pending' }),
      Complaint.countDocuments({ status: 'In Progress' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      User.countDocuments({ role: 'user' }),
      Complaint.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.json({
      success: true,
      stats: { total, pending, inProgress, resolved, totalUsers, byCategory },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};