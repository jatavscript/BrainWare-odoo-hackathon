import { Department } from '../models/Department.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listDepartments = asyncHandler(async (req, res) => {
  const items = await Department.find({}).sort({ name: 1 });
  res.json({ success: true, data: items });
});

export const getDepartment = asyncHandler(async (req, res) => {
  const item = await Department.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Department not found' });
  res.json({ success: true, data: item });
});

export const createDepartment = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const exists = await Department.findOne({ name });
  if (exists) return res.status(400).json({ success: false, message: 'Department exists' });
  const item = await Department.create({ name, description });
  res.status(201).json({ success: true, data: item });
});

export const updateDepartment = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const item = await Department.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
  if (!item) return res.status(404).json({ success: false, message: 'Department not found' });
  res.json({ success: true, data: item });
});

export const deleteDepartment = asyncHandler(async (req, res) => {
  const item = await Department.findById(req.params.id);
  if (!item) return res.status(404).json({ success: false, message: 'Department not found' });
  await Department.deleteOne({ _id: item._id });
  res.json({ success: true });
});
