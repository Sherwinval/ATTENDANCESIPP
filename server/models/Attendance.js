import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    participant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Participant',
    },
    studentId: {
      type: String,
      required: true,
      trim: true,
      match: /^\d{4}-\d{5}$/,
    },
    type: {
      type: String,
      enum: ['login', 'logout'],
      required: true,
    },
    recordedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model('Attendance', attendanceSchema);
