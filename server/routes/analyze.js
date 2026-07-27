const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const Groq = require('groq-sdk');
const authMiddleware = require('../middleware/auth');
const Analysis = require('../models/Analysis');

console.log("GROQ API KEY:", process.env.GROQ_API_KEY ? "Found ✅" : "Missing ❌");

// ── Groq Client ───────────────────────────────────────
function getGroqClient() {
  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY missing in .env');
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

// ── Multer Setup ─────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'), false);
  },
  limits: { fileSize: 10 * 1024 * 1024 }
});

// ── Extract Text from PDF ─────────────────────────────
async function extractText(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);
  const text = (data.text || '').trim();
  if (text.length < 30) throw new Error('PDF appears empty or image-based');
  return text;
}

// ── Call Groq AI ──────────────────────────────────────
async function callGroq(prompt) {
  const groq = getGroqClient();
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 2000,
  });
  return completion.choices[0].message.content;
}

// ── AI Analysis Function ──────────────────────────────
async function analyzeWithAI(resumeText, jobText) {
  const prompt = `
You are an expert ATS resume analyzer.

RESUME:
${resumeText.substring(0, 4000)}

JOB DESCRIPTION:
${jobText.substring(0, 3000)}

Return ONLY valid JSON with no extra text, no markdown, no explanation:
{
  "jobTitle": "",
  "matchScore": 0,
  "atsScore": 0,
  "skillsMatch": 0,
  "experienceMatch": 0,
  "educationMatch": 0,
  "presentSkills": [],
  "missingSkills": [],
  "suggestions": [],
  "overallFeedback": ""
}
`;

  const raw = await callGroq(prompt);

  const clean = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const jsonMatch = clean.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("AI RAW RESPONSE:", raw);
    throw new Error("Invalid AI response - no JSON found");
  }

  return JSON.parse(jsonMatch[0]);
}

// ── ANALYZE ROUTE ────────────────────────────────────
router.post('/', authMiddleware, upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'jobDescription', maxCount: 1 }
]), async (req, res) => {

  const resumePath = req.files?.resume?.[0]?.path;
  const jobPath = req.files?.jobDescription?.[0]?.path;

  try {
    if (!resumePath || !jobPath) {
      return res.status(400).json({ message: 'Upload both files' });
    }

    console.log("📄 Reading PDFs...");
    const [resumeText, jobText] = await Promise.all([
      extractText(resumePath),
      extractText(jobPath)
    ]);

    console.log("🤖 Calling Groq AI...");
    const aiResult = await analyzeWithAI(resumeText, jobText);

    const clamp = (v) => Math.min(100, Math.max(0, Number(v) || 0));

    const analysis = new Analysis({
      userId: req.user._id,
      jobTitle: aiResult.jobTitle || 'Unknown',
      matchScore: clamp(aiResult.matchScore),
      atsScore: clamp(aiResult.atsScore),
      skillsMatch: clamp(aiResult.skillsMatch),
      experienceMatch: clamp(aiResult.experienceMatch),
      educationMatch: clamp(aiResult.educationMatch),
      presentSkills: aiResult.presentSkills || [],
      missingSkills: aiResult.missingSkills || [],
      suggestions: aiResult.suggestions || [],
      overallFeedback: aiResult.overallFeedback || ''
    });

    await analysis.save();

    console.log("✅ Analysis complete!");
    res.json({ success: true, analysis });

  } catch (err) {
    console.error("❌ ERROR:", err.message);
    res.status(500).json({ message: "Analysis failed: " + err.message });

  } finally {
    [resumePath, jobPath].forEach(p => {
      try { if (p && fs.existsSync(p)) fs.unlinkSync(p); } catch {}
    });
  }
});

// ── CHAT ROUTE ───────────────────────────────────────
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message is required' });
    }

    console.log("💬 Chat message:", message);
    const reply = await callGroq(message);
    res.json({ reply });

  } catch (err) {
    console.error("❌ Chat Error:", err.message);
    res.status(500).json({ message: "Chat failed: " + err.message });
  }
});

module.exports = router;