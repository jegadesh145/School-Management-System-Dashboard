const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, unique: true },
  category: { type: String },
  quantity: { type: Number, default: 1 },
  available: { type: Number, default: 1 },
  publishedYear: { type: String },
  status: { type: String, enum: ['Available', 'Issued', 'Lost'], default: 'Available' },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
