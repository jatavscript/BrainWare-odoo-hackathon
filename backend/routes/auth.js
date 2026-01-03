import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post(
  '/signup',
  [
    body('employeeId').trim().notEmpty().withMessage('Employee ID is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('role').isIn(['employee', 'admin', 'hr']).withMessage('Invalid role'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { employeeId, email, password, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { employeeId }],
      });

      if (existingUser) {
        return res.status(400).json({
          message: 'User with this email or employee ID already exists',
        });
      }

      // Create user
      const user = await User.create({
        employeeId,
        email,
        password,
        role,
      });

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          employeeId: user.employeeId,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Signup error:', error);
      
      // Check MongoDB connection status
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ 
          message: 'Database connection error. Please ensure MongoDB is running. See MONGODB_SETUP.md for setup instructions.',
          error: 'MongoDB not connected',
          details: 'Cannot connect to MongoDB database. Please install MongoDB or use MongoDB Atlas (cloud).'
        });
      }
      
      // Check if it's a MongoDB connection error
      if (error.name === 'MongoServerError' || 
          error.name === 'MongoNetworkError' ||
          error.message?.includes('MongoServerError') || 
          error.message?.includes('MongoNetworkError') ||
          error.message?.includes('buffering timed out') ||
          error.message?.includes('ECONNREFUSED')) {
        return res.status(503).json({ 
          message: 'Database connection error. Please ensure MongoDB is running. See MONGODB_SETUP.md for setup instructions.',
          error: 'MongoDB not connected',
          details: 'Cannot connect to MongoDB database. Please install MongoDB or use MongoDB Atlas (cloud).'
        });
      }
      
      // Check if it's a validation error
      if (error.name === 'ValidationError') {
        return res.status(400).json({ 
          message: 'Validation error',
          error: error.message 
        });
      }
      
      res.status(500).json({ 
        message: 'Server error', 
        error: error.message 
      });
    }
  }
);

// @route   POST /api/auth/signin
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/signin',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user._id);

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          employeeId: user.employeeId,
          email: user.email,
          role: user.role,
          firstName: user.personalDetails?.firstName,
          lastName: user.personalDetails?.lastName,
        },
      });
    } catch (error) {
      console.error('Signin error:', error);
      
      // Check MongoDB connection status
      if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ 
          message: 'Database connection error. Please ensure MongoDB is running. See MONGODB_SETUP.md for setup instructions.',
          error: 'MongoDB not connected',
          details: 'Cannot connect to MongoDB database. Please install MongoDB or use MongoDB Atlas (cloud).'
        });
      }
      
      // Check if it's a MongoDB connection error
      if (error.name === 'MongoServerError' || 
          error.name === 'MongoNetworkError' ||
          error.message?.includes('MongoServerError') || 
          error.message?.includes('MongoNetworkError') ||
          error.message?.includes('buffering timed out') ||
          error.message?.includes('ECONNREFUSED')) {
        return res.status(503).json({ 
          message: 'Database connection error. Please ensure MongoDB is running. See MONGODB_SETUP.md for setup instructions.',
          error: 'MongoDB not connected',
          details: 'Cannot connect to MongoDB database. Please install MongoDB or use MongoDB Atlas (cloud).'
        });
      }
      
      res.status(500).json({ 
        message: 'Server error', 
        error: error.message 
      });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;

