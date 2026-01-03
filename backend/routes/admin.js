import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/admin/employees
// @desc    Get all employees
// @access  Private/Admin
router.get('/employees', async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({ success: true, employees });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/admin/employees/:id
// @desc    Deactivate employee
// @access  Private/Admin
router.delete('/employees/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    user.isActive = false;
    await user.save();

    res.json({ success: true, message: 'Employee deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/employees/:id/activate
// @desc    Activate employee
// @access  Private/Admin
router.put('/employees/:id/activate', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    user.isActive = true;
    await user.save();

    res.json({ success: true, message: 'Employee activated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

