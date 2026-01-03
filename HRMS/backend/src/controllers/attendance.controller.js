import dayjs from 'dayjs';
import { Attendance } from '../models/Attendance.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const startOfDay = (d = new Date()) => dayjs(d).startOf('day').toDate();

export const checkIn = asyncHandler(async (req, res) => {
  const today = startOfDay();
  const existing = await Attendance.findOne({ user: req.user.id, date: today });
  if (existing?.checkIn) {
    return res.status(400).json({ success: false, message: 'Already checked in' });
  }
  const now = new Date();
  const status = now.getHours() >= 10 ? 'Late' : 'Present';
  const record = existing
    ? await Attendance.findByIdAndUpdate(existing._id, { checkIn: now, status }, { new: true })
    : await Attendance.create({ user: req.user.id, date: today, checkIn: now, status });
  res.status(201).json({ success: true, data: record });
});

export const checkOut = asyncHandler(async (req, res) => {
  const today = startOfDay();
  const record = await Attendance.findOne({ user: req.user.id, date: today });
  if (!record?.checkIn) return res.status(400).json({ success: false, message: 'Not checked in' });
  if (record.checkOut) return res.status(400).json({ success: false, message: 'Already checked out' });
  const now = new Date();
  const totalHours = (now - record.checkIn) / 36e5;
  record.checkOut = now;
  record.totalHours = Math.max(0, Math.round(totalHours * 100) / 100);
  await record.save();
  res.json({ success: true, data: record });
});

export const myAttendance = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, month } = req.query;
  const filter = { user: req.user.id };
  if (month) {
    const m = dayjs(month + '-01');
    filter.date = { $gte: m.startOf('month').toDate(), $lte: m.endOf('month').toDate() };
  }
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [items, total] = await Promise.all([
    Attendance.find(filter).sort({ date: -1 }).skip(skip).limit(parseInt(limit)),
    Attendance.countDocuments(filter),
  ]);
  res.json({ success: true, data: items, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
});

export const listAttendance = asyncHandler(async (req, res) => {
  const { user, from, to, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (user) filter.user = user;
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = dayjs(from).startOf('day').toDate();
    if (to) filter.date.$lte = dayjs(to).endOf('day').toDate();
  }
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [items, total] = await Promise.all([
    Attendance.find(filter).populate('user', 'name email role').sort({ date: -1 }).skip(skip).limit(parseInt(limit)),
    Attendance.countDocuments(filter),
  ]);
  res.json({ success: true, data: items, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
});
