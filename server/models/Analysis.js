const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobTitle: { type: String, default: 'Unknown Role' },
  matchScore: { type: Number, required: true },
  missingSkills: [String],
  presentSkills: [String],
  suggestions: [String],
  overallFeedback: String,
  atsScore: Number,
  experienceMatch: Number,
  educationMatch: Number,
  skillsMatch: Number,
  resumeText: String,
  jobText: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analysis', analysisSchema);