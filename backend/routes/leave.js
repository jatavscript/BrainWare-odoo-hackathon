import express from 'express';
import Leave from '../models/Leave.js';
import { getDefaultUser } from '../utils/userHelper.js';

const router = express.Router();

// @route   POST /api/leave
// @desc    Apply for leave
// @access  Public
router.post('/', async (req, res) => {
  try {
    const user = await getDefaultUser();
    const { leaveType, startDate, endDate, remarks } = req.body;

    if (!leaveType || !startDate || !endDate) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({ message: 'Start date must be before end date' });
    }

    // Calculate days
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const leave = await Leave.create({
      employeeId: user._id,
      leaveType,
      startDate: start,
      endDate: end,
      days,
      remarks: remarks || '',
    });

    res.status(201).json({ success: true, leave });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/leave/my
// @desc    Get current user's leave requests
// @access  Public
router.get('/my', async (req, res) => {
  try {
    const user = await getDefaultUser();
    const leaves = await Leave.find({ employeeId: user._id })
      .sort({ appliedAt: -1 })
      .populate('approvedBy', 'employeeId personalDetails');

    res.json({ success: true, leaves });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/leave
// @desc    Get all leave requests
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, employeeId } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (employeeId) query.employeeId = employeeId;

    const leaves = await Leave.find(query)
      .sort({ appliedAt: -1 })
      .populate('employeeId', 'employeeId personalDetails jobDetails')
      .populate('approvedBy', 'employeeId personalDetails');

    res.json({ success: true, leaves });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/leave/:id/approve
// @desc    Approve leave request
// @access  Public
router.put('/:id/approve', async (req, res) => {
  try {
    const user = await getDefaultUser();
    const { adminComments } = req.body;
    
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leave.status = 'approved';
    leave.approvedBy = user._id;
    leave.adminComments = adminComments || '';
    leave.reviewedAt = new Date();

    await leave.save();
    res.json({ success: true, leave });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/leave/:id/reject
// @desc    Reject leave request
// @access  Public
router.put('/:id/reject', async (req, res) => {
  try {
    const user = await getDefaultUser();
    const { adminComments } = req.body;
    
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    leave.status = 'rejected';
    leave.approvedBy = user._id;
    leave.adminComments = adminComments || '';
    leave.reviewedAt = new Date();

    await leave.save();
    res.json({ success: true, leave });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

