import express from 'express';
import Attendance from '../models/Attendance.js';
import Leave from '../models/Leave.js';
import Payroll from '../models/Payroll.js';
import User from '../models/User.js';
import { getDefaultUser } from '../utils/userHelper.js';

const router = express.Router();

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics
// @access  Public
router.get('/dashboard', async (req, res) => {
  try {
    const user = await getDefaultUser();
    const isAdmin = user.role === 'admin' || user.role === 'hr';
    
    if (isAdmin) {
      // Admin dashboard stats
      const totalEmployees = await User.countDocuments({ role: 'employee', isActive: true });
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayAttendance = await Attendance.countDocuments({ date: today, status: 'present' });
      
      const pendingLeaves = await Leave.countDocuments({ status: 'pending' });
      
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const monthlyPayroll = await Payroll.countDocuments({ month: currentMonth, year: currentYear });

      res.json({
        success: true,
        stats: {
          totalEmployees,
          todayAttendance,
          pendingLeaves,
          monthlyPayroll,
        },
      });
    } else {
      // Employee dashboard stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayAttendance = await Attendance.findOne({
        employeeId: user._id,
        date: today,
      });

      const pendingLeaves = await Leave.countDocuments({
        employeeId: user._id,
        status: 'pending',
      });

      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const monthlyPayroll = await Payroll.findOne({
        employeeId: user._id,
        month: currentMonth,
        year: currentYear,
      });

      // Get this month's attendance
      const startDate = new Date(currentYear, currentMonth - 1, 1);
      const endDate = new Date(currentYear, currentMonth, 0);
      const monthlyAttendance = await Attendance.find({
        employeeId: user._id,
        date: { $gte: startDate, $lte: endDate },
      });

      const presentDays = monthlyAttendance.filter(a => a.status === 'present').length;

      res.json({
        success: true,
        stats: {
          todayAttendance,
          pendingLeaves,
          monthlyPayroll,
          presentDays,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/analytics/reports
// @desc    Get reports data
// @access  Public
router.get('/reports', async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;

    if (type === 'attendance') {
      const attendance = await Attendance.find({
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      })
        .populate('employeeId', 'employeeId personalDetails jobDetails')
        .sort({ date: -1 });

      res.json({ success: true, data: attendance });
    } else if (type === 'payroll') {
      const payroll = await Payroll.find({
        year: parseInt(req.query.year),
        month: parseInt(req.query.month),
      })
        .populate('employeeId', 'employeeId personalDetails jobDetails')
        .sort({ createdAt: -1 });

      res.json({ success: true, data: payroll });
    } else {
      res.status(400).json({ message: 'Invalid report type' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

