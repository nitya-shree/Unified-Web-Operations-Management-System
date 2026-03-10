const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getUserComplaints,
  getComplaintById,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getUserComplaints).post(createComplaint);
router.route('/:id').get(getComplaintById);

module.exports = router;