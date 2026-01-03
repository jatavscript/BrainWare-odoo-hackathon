import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/profile
// @desc    Get user profile (default to first user or create demo user)
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Get first user or create a demo user
    let user = await User.findOne().select('-password');
    
    if (!user) {
      // Create a demo user if none exists
      user = await User.create({
        employeeId: 'DEMO001',
        email: 'demo@dayflow.com',
        password: 'demo123',
        role: 'employee',
        personalDetails: {
          firstName: 'Demo',
          lastName: 'User',
        },
      });
      user = await User.findById(user._id).select('-password');
    }
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Public
router.put('/', async (req, res) => {
  try {
    let user = await User.findOne();
    if (!user) {
      user = await User.create({
        employeeId: 'DEMO001',
        email: 'demo@dayflow.com',
        password: 'demo123',
        role: 'employee',
      });
    }

    // Employees can only update limited fields
    if (user.role === 'employee') {
      const { address, phone, profilePicture } = req.body;
      
      if (address !== undefined) user.personalDetails.address = address;
      if (phone !== undefined) user.personalDetails.phone = phone;
      if (profilePicture !== undefined) user.personalDetails.profilePicture = profilePicture;
    } else {
      // Admin/HR can update all fields
      const {
        firstName,
        lastName,
        phone,
        address,
        dateOfBirth,
        profilePicture,
        department,
        position,
        joiningDate,
        employmentType,
        baseSalary,
        allowances,
        deductions,
      } = req.body;

      if (firstName !== undefined) user.personalDetails.firstName = firstName;
      if (lastName !== undefined) user.personalDetails.lastName = lastName;
      if (phone !== undefined) user.personalDetails.phone = phone;
      if (address !== undefined) user.personalDetails.address = address;
      if (dateOfBirth !== undefined) user.personalDetails.dateOfBirth = dateOfBirth;
      if (profilePicture !== undefined) user.personalDetails.profilePicture = profilePicture;
      if (department !== undefined) user.jobDetails.department = department;
      if (position !== undefined) user.jobDetails.position = position;
      if (joiningDate !== undefined) user.jobDetails.joiningDate = joiningDate;
      if (employmentType !== undefined) user.jobDetails.employmentType = employmentType;
      if (baseSalary !== undefined) user.salary.baseSalary = baseSalary;
      if (allowances !== undefined) user.salary.allowances = allowances;
      if (deductions !== undefined) user.salary.deductions = deductions;
    }

    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/profile/:id
// @desc    Get employee profile
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/profile/:id
// @desc    Update employee profile
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const {
      firstName,
      lastName,
      phone,
      address,
      dateOfBirth,
      profilePicture,
      department,
      position,
      joiningDate,
      employmentType,
      baseSalary,
      allowances,
      deductions,
    } = req.body;

    if (firstName !== undefined) user.personalDetails.firstName = firstName;
    if (lastName !== undefined) user.personalDetails.lastName = lastName;
    if (phone !== undefined) user.personalDetails.phone = phone;
    if (address !== undefined) user.personalDetails.address = address;
    if (dateOfBirth !== undefined) user.personalDetails.dateOfBirth = dateOfBirth;
    if (profilePicture !== undefined) user.personalDetails.profilePicture = profilePicture;
    if (department !== undefined) user.jobDetails.department = department;
    if (position !== undefined) user.jobDetails.position = position;
    if (joiningDate !== undefined) user.jobDetails.joiningDate = joiningDate;
    if (employmentType !== undefined) user.jobDetails.employmentType = employmentType;
    if (baseSalary !== undefined) user.salary.baseSalary = baseSalary;
    if (allowances !== undefined) user.salary.allowances = allowances;
    if (deductions !== undefined) user.salary.deductions = deductions;

    await user.save();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

