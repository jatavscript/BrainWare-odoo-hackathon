import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true, index: true },
    checkIn: { type: Date },
    checkOut: { type: Date },
    totalHours: { type: Number, default: 0 },
    status: { type: String, enum: ['Present', 'Absent', 'Late'], default: 'Present' }
  },
  { timestamps: true }
);

AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model('Attendance', AttendanceSchema);
