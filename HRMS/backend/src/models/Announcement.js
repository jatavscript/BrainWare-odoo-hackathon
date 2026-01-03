import mongoose from 'mongoose';

const AnnouncementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    audience: { type: String, enum: ['All', 'HR', 'Admin', 'Employee'], default: 'All' }
  },
  { timestamps: true }
);

export const Announcement = mongoose.model('Announcement', AnnouncementSchema);
