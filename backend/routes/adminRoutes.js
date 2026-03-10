const express = require('express');
const router = express.Router();
const {
  getAllComplaints,
  updateComplaint,
  deleteComplaint,
  getDashboardStats,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.route('/complaints').get(getAllComplaints);
router.route('/complaints/:id').put(updateComplaint).delete(deleteComplaint);

module.exports = router;