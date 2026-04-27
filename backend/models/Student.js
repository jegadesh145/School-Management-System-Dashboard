const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  class: { type: String, required: true },
  section: { type: String, default: 'A' },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  dateOfBirth: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], default: 'Male' },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
