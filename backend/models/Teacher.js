const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  class: { type: String },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  qualification: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  joinDate: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Teacher', teacherSchema);
