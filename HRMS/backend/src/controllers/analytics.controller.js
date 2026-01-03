import dayjs from 'dayjs';
import { User } from '../models/User.js';
import { Employee } from '../models/Employee.js';
import { Department } from '../models/Department.js';
import { Attendance } from '../models/Attendance.js';
import { Leave } from '../models/Leave.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Simple rule-based attrition risk: high if frequent leaves + low attendance hours
function computeAttritionRisk({ totalHoursMonth, leavesCount }) {
  if (leavesCount >= 3 || totalHoursMonth < 80) return 'High';
  if (leavesCount === 2 || totalHoursMonth < 120) return 'Medium';
  return 'Low';
}

export const overview = asyncHandler(async (req, res) => {
  const monthStart = dayjs().startOf('month').toDate();
  const monthEnd = dayjs().endOf('month').toDate();

  const [totalEmployees, departments, leavesPending, attendanceThisMonth] = await Promise.all([
    Employee.countDocuments({}),
    Department.aggregate([{ $group: { _id: '$name', count: { $sum: 1 } } }]),
    Leave.countDocuments({ status: 'Pending' }),
    Attendance.aggregate([
      { $match: { date: { $gte: monthStart, $lte: monthEnd } } },
      { $group: { _id: '$user', hours: { $sum: '$totalHours' } } }
    ])
  ]);

  const deptDistribution = await Employee.aggregate([
    { $group: { _id: '$department', count: { $sum: 1 } } },
    { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'dept' } },
    { $unwind: { path: '$dept', preserveNullAndEmptyArrays: true } },
    { $project: { _id: 0, department: '$dept.name', count: 1 } }
  ]);

  res.json({ success: true, data: {
    kpis: {
      totalEmployees,
      pendingLeaves: leavesPending,
      attendanceRecordsThisMonth: attendanceThisMonth.length,
    },
    deptDistribution,
  }});
});

export const attritionRisks = asyncHandler(async (req, res) => {
  const monthStart = dayjs().startOf('month').toDate();
  const monthEnd = dayjs().endOf('month').toDate();

  const [employees, hoursAgg, leavesAgg] = await Promise.all([
    Employee.find({}).populate('user', 'name email'),
    Attendance.aggregate([
      { $match: { date: { $gte: monthStart, $lte: monthEnd } } },
      { $group: { _id: '$user', totalHours: { $sum: '$totalHours' } } }
    ]),
    Leave.aggregate([
      { $match: { createdAt: { $gte: monthStart, $lte: monthEnd } } },
      { $group: { _id: '$user', leaves: { $sum: 1 } } }
    ])
  ]);

  const hoursMap = new Map(hoursAgg.map(h => [String(h._id), h.totalHours]));
  const leavesMap = new Map(leavesAgg.map(l => [String(l._id), l.leaves]));

  const result = employees.map(e => {
    const uid = String(e.user._id);
    const totalHoursMonth = hoursMap.get(uid) || 0;
    const leavesCount = leavesMap.get(uid) || 0;
    const risk = computeAttritionRisk({ totalHoursMonth, leavesCount });
    return { employeeId: e.employeeId, name: e.user.name, email: e.user.email, risk, totalHoursMonth, leavesCount };
  });

  res.json({ success: true, data: result });
});

export const smartAttendance = asyncHandler(async (req, res) => {
  const last30 = dayjs().subtract(30, 'day').startOf('day').toDate();
  const items = await Attendance.find({ date: { $gte: last30 } }).populate('user', 'name email');
  const lateArrivals = items.filter(i => i.status === 'Late').length;
  const avgHours = items.length ? (items.reduce((a, b) => a + (b.totalHours || 0), 0) / items.length) : 0;
  res.json({ success: true, data: { last30: items.length, lateArrivals, avgHours: Math.round(avgHours * 100) / 100 } });
});
