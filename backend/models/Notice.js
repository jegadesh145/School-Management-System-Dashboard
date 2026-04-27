const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['General', 'Exam', 'Holiday', 'Event', 'Urgent'], default: 'General' },
  audience: { type: String, enum: ['All', 'Students', 'Teachers', 'Parents'], default: 'All' },
  publishedDate: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
