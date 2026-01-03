import { Employee } from '../models/Employee.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listEmployees = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 10, status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (q) filter.$or = [
    { designation: new RegExp(q, 'i') },
  ];
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [items, total] = await Promise.all([
    Employee.find(filter).populate('user', 'name email role').populate('department', 'name').skip(skip).limit(parseInt(limit)).sort({ createdAt: -1 }),
    Employee.countDocuments(filter)
  ]);
  res.json({ success: true, data: items, pagination: { total, page: parseInt(page), limit: parseInt(limit) } });
});

export const getEmployee = asyncHandler(async (req, res) => {
  const emp = await Employee.findById(req.params.id).populate('user', 'name email role').populate('department', 'name');
  if (!emp) return res.status(404).json({ success: false, message: 'Employee not found' });
  res.json({ success: true, data: emp });
});

export const createEmployee = asyncHandler(async (req, res) => {
  const { name, email, password, employeeId, department, designation, status, avatarUrl } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ success: false, message: 'Email already used' });
  const user = await User.create({ name, email, password, role: 'employee', isApproved: true });
  const emp = await Employee.create({ user: user._id, employeeId, department, designation, status, avatarUrl });
  res.status(201).json({ success: true, data: await emp.populate('user', 'name email role') });
});

export const updateEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { department, designation, status, avatarUrl } = req.body;
  const emp = await Employee.findByIdAndUpdate(id, { department, designation, status, avatarUrl }, { new: true });
  if (!emp) return res.status(404).json({ success: false, message: 'Employee not found' });
  res.json({ success: true, data: emp });
});

export const deleteEmployee = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const emp = await Employee.findById(id);
  if (!emp) return res.status(404).json({ success: false, message: 'Employee not found' });
  await Employee.deleteOne({ _id: id });
  await User.deleteOne({ _id: emp.user });
  res.json({ success: true });
});
