const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  studentName: { type: String },
  rollNo: { type: String },
  class: { type: String },
  date: { type: String, required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Late'], default: 'Present' },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
