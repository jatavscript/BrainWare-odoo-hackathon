import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    employeeId: { type: String, required: true, unique: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    designation: { type: String },
    status: { type: String, enum: ['Active', 'On Leave', 'Resigned'], default: 'Active' },
    joinDate: { type: Date, default: Date.now },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

export const Employee = mongoose.model('Employee', EmployeeSchema);
