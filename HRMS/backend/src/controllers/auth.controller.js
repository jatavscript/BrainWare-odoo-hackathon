import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const signToken = (user) =>
  jwt.sign({ id: user._id.toString(), role: user.role, name: user.name }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });
  const user = await User.create({ name, email, password, role: 'employee', isApproved: false });
  res.status(201).json({ success: true, data: { id: user._id } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(400).json({ success: false, message: 'Invalid credentials' });
  if (!user.isApproved) return res.status(403).json({ success: false, message: 'Awaiting approval' });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(400).json({ success: false, message: 'Invalid credentials' });
  const token = signToken(user);
  res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

export const approveUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { isApproved: true }, { new: true });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role, isApproved: user.isApproved } });
});
