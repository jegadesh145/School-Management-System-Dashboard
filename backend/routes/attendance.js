const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// GET attendance by date and class
router.get('/', async (req, res) => {
  try {
    const { date, class: cls } = req.query;
    const query = {};
    if (date) query.date = date;
    if (cls) query.class = cls;
    const records = await Attendance.find(query);
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST bulk attendance
router.post('/bulk', async (req, res) => {
  try {
    const { records } = req.body; // array of attendance records
    // Remove existing records for same date+class
    if (records.length > 0) {
      await Attendance.deleteMany({ date: records[0].date, class: records[0].class });
    }
    const saved = await Attendance.insertMany(records);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET summary stats for a date
router.get('/summary', async (req, res) => {
  try {
    const { date } = req.query;
    const present = await Attendance.countDocuments({ date, status: 'Present' });
    const absent = await Attendance.countDocuments({ date, status: 'Absent' });
    const late = await Attendance.countDocuments({ date, status: 'Late' });
    res.json({ present, absent, late, total: present + absent + late });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
