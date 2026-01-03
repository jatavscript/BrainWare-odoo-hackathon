import { Announcement } from '../models/Announcement.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listAnnouncements = asyncHandler(async (req, res) => {
  const items = await Announcement.find({}).populate('createdBy', 'name role').sort({ createdAt: -1 });
  res.json({ success: true, data: items });
});

export const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, message, audience = 'All' } = req.body;
  const item = await Announcement.create({ title, message, audience, createdBy: req.user.id });
  res.status(201).json({ success: true, data: item });
});

export const deleteAnnouncement = asyncHandler(async (req, res) => {
  await Announcement.deleteOne({ _id: req.params.id });
  res.json({ success: true });
});
