const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Analysis = require('../models/Analysis');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-resumeText -jobText');
    res.json({ analyses });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching history' });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.user._id });
    if (!analysis) return res.status(404).json({ message: 'Not found' });
    res.json({ analysis });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching analysis' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Analysis.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting' });
  }
});

module.exports = router;