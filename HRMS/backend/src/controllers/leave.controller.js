import { Leave } from '../models/Leave.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const applyLeave = asyncHandler(async (req, res) => {
  const { type, startDate, endDate, reason } = req.body;
  const item = await Leave.create({ user: req.user.id, type, startDate, endDate, reason });
  res.status(201).json({ success: true, data: item });
});

export const myLeaves = asyncHandler(async (req, res) => {
  const items = await Leave.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json({ success: true, data: items });
});

export const listLeaves = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const items = await Leave.find(filter).populate('user', 'name email').sort({ createdAt: -1 });
  res.json({ success: true, data: items });
});

export const updateLeaveStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Approved / Rejected
  const updated = await Leave.findByIdAndUpdate(id, { status, approver: req.user.id }, { new: true });
  if (!updated) return res.status(404).json({ success: false, message: 'Leave not found' });
  res.json({ success: true, data: updated });
});
