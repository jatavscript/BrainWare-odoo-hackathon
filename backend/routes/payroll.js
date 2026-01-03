import express from 'express';
import Payroll from '../models/Payroll.js';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import { getDefaultUser } from '../utils/userHelper.js';

const router = express.Router();

// @route   GET /api/payroll/my
// @desc    Get current user's payroll
// @access  Public
router.get('/my', async (req, res) => {
  try {
    const user = await getDefaultUser();
    const { month, year } = req.query;
    
    let query = { employeeId: user._id };
    if (month && year) {
      query.month = parseInt(month);
      query.year = parseInt(year);
    }

    const payroll = await Payroll.find(query)
      .sort({ year: -1, month: -1 });

    res.json({ success: true, payroll });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/payroll
// @desc    Get all payroll
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { employeeId, month, year } = req.query;
    
    let query = {};
    if (employeeId) query.employeeId = employeeId;
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const payroll = await Payroll.find(query)
      .sort({ year: -1, month: -1 })
      .populate('employeeId', 'employeeId personalDetails jobDetails');

    res.json({ success: true, payroll });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/payroll/generate
// @desc    Generate payroll for employee
// @access  Public
router.post('/generate', async (req, res) => {
  try {
    const { employeeId, month, year } = req.body;

    if (!employeeId || !month || !year) {
      return res.status(400).json({ message: 'Please provide employeeId, month, and year' });
    }

    // Check if payroll already exists
    const existing = await Payroll.findOne({ employeeId, month, year });
    if (existing) {
      return res.status(400).json({ message: 'Payroll for this month already exists' });
    }

    const user = await User.findById(employeeId);
    if (!user) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Calculate attendance
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const attendance = await Attendance.find({
      employeeId,
      date: { $gte: startDate, $lte: endDate },
    });

    const presentDays = attendance.filter(a => a.status === 'present' || a.status === 'half-day').length;
    const leaveDays = attendance.filter(a => a.status === 'leave').length;
    const totalDays = endDate.getDate();

    // Calculate salary
    const baseSalary = user.salary.baseSalary || 0;
    const allowances = user.salary.allowances || 0;
    const deductions = user.salary.deductions || 0;
    
    const dailySalary = baseSalary / totalDays;
    const earnedSalary = dailySalary * presentDays;
    const netSalary = earnedSalary + allowances - deductions;

    const payroll = await Payroll.create({
      employeeId,
      month,
      year,
      baseSalary,
      allowances,
      deductions,
      totalDays,
      presentDays,
      leaveDays,
      netSalary: Math.round(netSalary * 100) / 100,
      status: 'processed',
    });

    res.status(201).json({ success: true, payroll });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/payroll/:id
// @desc    Update payroll
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { baseSalary, allowances, deductions, bonus, overtime, status, notes } = req.body;
    
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll not found' });
    }

    if (baseSalary !== undefined) payroll.baseSalary = baseSalary;
    if (allowances !== undefined) payroll.allowances = allowances;
    if (deductions !== undefined) payroll.deductions = deductions;
    if (bonus !== undefined) payroll.bonus = bonus;
    if (overtime !== undefined) payroll.overtime = overtime;
    if (status !== undefined) payroll.status = status;
    if (notes !== undefined) payroll.notes = notes;

    // Recalculate net salary
    const dailySalary = payroll.baseSalary / payroll.totalDays;
    const earnedSalary = dailySalary * payroll.presentDays;
    payroll.netSalary = Math.round((earnedSalary + payroll.allowances + (payroll.bonus || 0) + (payroll.overtime || 0) - payroll.deductions) * 100) / 100;

    await payroll.save();
    res.json({ success: true, payroll });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

