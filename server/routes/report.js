const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const Analysis = require('../models/Analysis');

// 🚀 IMPORTANT: authMiddleware REMOVED
router.get('/:id', async (req, res) => {
  try {
    const analysis = await Analysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const doc = new PDFDocument({ margin: 50 });

    // Headers for download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=analysis-${analysis._id}.pdf`
    );

    doc.pipe(res);

    // ===== HEADER =====
    doc.rect(0, 0, doc.page.width, 100).fill('#0f172a');

    doc
      .fillColor('#ffffff')
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('AI Resume Analysis Report', 50, 30);

    doc
      .fillColor('#94a3b8')
      .fontSize(11)
      .font('Helvetica')
      .text(
        `Generated: ${new Date(
          analysis.createdAt
        ).toLocaleDateString()}  |  Role: ${analysis.jobTitle}`,
        50,
        65
      );

    // ===== SCORES =====
    doc.moveDown(3);

    doc
      .fillColor('#0f172a')
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Score Overview', 50, 120);

    doc.moveTo(50, 142).lineTo(550, 142).strokeColor('#e2e8f0').stroke();

    const scores = [
      { label: 'Overall Match', value: analysis.matchScore },
      { label: 'ATS Score', value: analysis.atsScore },
      { label: 'Skills Match', value: analysis.skillsMatch },
      { label: 'Experience Match', value: analysis.experienceMatch },
      { label: 'Education Match', value: analysis.educationMatch }
    ];

    let y = 158;

    scores.forEach(score => {
      doc.fillColor('#374151').fontSize(11).text(score.label, 50, y);

      const barWidth = Math.max(0, Math.min(300, (score.value / 100) * 300));

      const color =
        score.value >= 75
          ? '#10b981'
          : score.value >= 50
          ? '#f59e0b'
          : '#ef4444';

      doc.rect(200, y - 2, 300, 14).fillColor('#f1f5f9').fill();
      doc.rect(200, y - 2, barWidth, 14).fillColor(color).fill();

      doc
        .fillColor('#0f172a')
        .fontSize(11)
        .font('Helvetica-Bold')
        .text(`${score.value}%`, 510, y);

      y += 28;
    });

    // ===== FEEDBACK =====
    y += 15;

    doc
      .fillColor('#0f172a')
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Overall Feedback', 50, y);

    y += 22;

    doc.rect(50, y, 500, 70).fillColor('#f8fafc').fill();

    doc
      .fillColor('#374151')
      .fontSize(10)
      .text(analysis.overallFeedback || '', 60, y + 10, {
        width: 480,
        height: 55
      });

    y += 85;

    // ===== SKILLS PRESENT =====
    doc
      .fillColor('#0f172a')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Skills Present', 50, y);

    y += 20;

    (analysis.presentSkills || []).slice(0, 10).forEach(s => {
      doc.rect(50, y, doc.widthOfString(s) + 16, 20).fillColor('#d1fae5').fill();

      doc.fillColor('#065f46').fontSize(9).text(s, 58, y + 6);

      y += 26;
    });

    // ===== MISSING SKILLS =====
    y += 10;

    doc
      .fillColor('#0f172a')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Missing Skills', 50, y);

    y += 20;

    (analysis.missingSkills || []).slice(0, 10).forEach(s => {
      doc.rect(50, y, doc.widthOfString(s) + 16, 20).fillColor('#fee2e2').fill();

      doc.fillColor('#991b1b').fontSize(9).text(s, 58, y + 6);

      y += 26;
    });

    // ===== SUGGESTIONS =====
    y += 10;

    if (y > 650) {
      doc.addPage();
      y = 50;
    }

    doc
      .fillColor('#0f172a')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('Improvement Suggestions', 50, y);

    y += 20;

    (analysis.suggestions || []).forEach((s, i) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      doc
        .fillColor('#374151')
        .fontSize(10)
        .text(`${i + 1}. ${s}`, 50, y, { width: 500 });

      y += doc.heightOfString(s, { width: 500 }) + 10;
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Report failed', error: err.message });
  }
});

module.exports = router;