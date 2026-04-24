const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// In-memory storage for simplicity; in production, use a proper DB
let documents = [];

// Route to upload PDF
app.post('/upload', upload.single('pdf'), async (req, res) => {
  console.log('Upload request received', { headers: req.headers, body: req.body, filePresent: !!req.file });

  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded under field name pdf' });
  }

  try {
    const data = await pdfParse(req.file.buffer);
    const text = data.text;

    // Store the text
    const docId = Date.now().toString();
    documents.push({ id: docId, text });

    res.json({ message: 'Document uploaded and processed', docId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process PDF' });
  }
});

// Route to generate exam
app.post('/generate-exam', async (req, res) => {
  const { docId, type, level } = req.body;

  const doc = documents.find(d => d.id === docId);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }

  const content = doc.text;

  // Generate exam using Google Gemini
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Based on the following content, generate a ${level} level ${type} exam with 5 questions. Provide the questions and correct answers in a structured format.

Content: ${content.substring(0, 2000)}`; // Limit content length

  try {
    const result = await model.generateContent(prompt);
    const exam = result.response.text();
    res.json({ exam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate exam' });
  }
});

// Route to grade exam
app.post('/grade-exam', async (req, res) => {
  const { docId, exam, answers } = req.body;

  const doc = documents.find(d => d.id === docId);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }

  const content = doc.text;

  // Grade using Gemini
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const prompt = `Based on the following content and exam, grade the student's answers. Provide a score out of 100 and feedback.

Content: ${content.substring(0, 2000)}
Exam: ${exam}
Student Answers: ${answers}`;

  try {
    const result = await model.generateContent(prompt);
    const grade = result.response.text();
    res.json({ grade });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to grade exam' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});