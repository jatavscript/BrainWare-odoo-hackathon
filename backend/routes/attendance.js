import express from 'express';
import Attendance from '../models/Attendance.js';
import { getDefaultUser } from '../utils/userHelper.js';
import User from '../models/User.js';

const router = express.Router();

// @route   POST /api/attendance/checkin
// @desc    Check in for the day
// @access  Public
router.post('/checkin', async (req, res) => {
  try {
    const user = await getDefaultUser();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existing = await Attendance.findOne({
      employeeId: user._id,
      date: today,
    });

    if (existing && existing.checkIn) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const attendance = existing || new Attendance({
      employeeId: user._id,
      date: today,
    });

    attendance.checkIn = new Date();
    attendance.status = 'present';
    await attendance.save();

    res.json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/attendance/checkout
// @desc    Check out for the day
// @access  Public
router.post('/checkout', async (req, res) => {
  try {
    const user = await getDefaultUser();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employeeId: user._id,
      date: today,
    });

    if (!attendance || !attendance.checkIn) {
      return res.status(400).json({ message: 'Please check in first' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: 'Already checked out today' });
    }

    attendance.checkOut = new Date();
    
    // Calculate working hours
    const hours = (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60);
    attendance.workingHours = Math.round(hours * 100) / 100;

    await attendance.save();

    res.json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/attendance/my
// @desc    Get current user's attendance
// @access  Public
router.get('/my', async (req, res) => {
  try {
    const user = await getDefaultUser();
    const { startDate, endDate } = req.query;
    
    let query = { employeeId: user._id };
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .populate('employeeId', 'employeeId personalDetails');

    res.json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/attendance
// @desc    Get all attendance
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    
    let query = {};
    
    if (employeeId) {
      query.employeeId = employeeId;
    }
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .populate('employeeId', 'employeeId personalDetails jobDetails');

    res.json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/attendance/:id
// @desc    Update attendance
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { status, checkIn, checkOut, notes } = req.body;
    
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    if (status !== undefined) attendance.status = status;
    if (checkIn !== undefined) attendance.checkIn = new Date(checkIn);
    if (checkOut !== undefined) attendance.checkOut = new Date(checkOut);
    if (notes !== undefined) attendance.notes = notes;

    if (attendance.checkIn && attendance.checkOut) {
      const hours = (attendance.checkOut - attendance.checkIn) / (1000 * 60 * 60);
      attendance.workingHours = Math.round(hours * 100) / 100;
    }

    await attendance.save();
    res.json({ success: true, attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

