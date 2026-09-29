import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT || 3000);
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 8;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: MAX_FILES, fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => cb(null, ALLOWED.includes(file.mimetype))
});

// Lightweight security headers; no extra dependency required.
app.disable('x-powered-by');
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));

app.get('/healthz', (_req, res) => {
  res.status(200).json({ ok: true, service: 'side-decks-web' });
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT || 465),
  secure: String(process.env.SMTP_SECURE ?? 'true') === 'true',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

const clean = (value = '') => String(value).replace(/[<>\r\n]/g, ' ').trim();
const cleanFilename = (value = 'attachment') => path.basename(String(value)).replace(/[\r\n]/g, '_');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post('/api/quote', upload.array('projectFiles', MAX_FILES), async (req, res) => {
  try {
    // Honeypot: bots that fill the hidden website field get a harmless success response.
    if (req.body.website) return res.json({ ok: true });

    const {
      name, phone, email, address, projectType, timeline, budget,
      message, contactPreference, size, referral
    } = req.body;

    if (!name || !phone || !email || !address || !projectType || !timeline) {
      return res.status(400).json({ ok: false, message: 'Please complete all required fields.' });
    }

    if (!emailPattern.test(String(email))) {
      return res.status(400).json({ ok: false, message: 'Please enter a valid email address.' });
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(500).json({ ok: false, message: 'Email delivery is not configured yet. Please contact Side Decks directly.' });
    }

    const safeName = clean(name);
    const safeEmail = clean(email);
    const safePhone = clean(phone);
    const safeAddress = clean(address);
    const safeProjectType = clean(projectType);
    const safeTimeline = clean(timeline);
    const safeBudget = clean(budget || 'Not provided');
    const safeContact = clean(contactPreference || 'Not provided');
    const safeSize = clean(size || 'Not provided');
    const safeReferral = clean(referral || 'Not provided');
    const safeMessage = clean(message || 'No additional details provided.');
    const files = req.files || [];

    const text = [
      'NEW SIDE DECKS PROJECT INQUIRY', '',
      `Name: ${safeName}`,
      `Phone: ${safePhone}`,
      `Email: ${safeEmail}`,
      `Home / Project Address: ${safeAddress}`, '',
      `Project Type: ${safeProjectType}`,
      `Anticipated Timeline: ${safeTimeline}`,
      `Estimated Budget: ${safeBudget}`,
      `Preferred Contact: ${safeContact}`,
      `Approximate Deck Size: ${safeSize}`,
      `How They Heard About Us: ${safeReferral}`, '',
      'Project Details:',
      safeMessage, '',
      `Uploaded Files: ${files.map(f => cleanFilename(f.originalname)).join(', ') || 'None'}`
    ].join('\n');

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.MAIL_TO || 'sidedecks910@gmail.com',
      replyTo: safeEmail,
      subject: `New Side Decks Project Inquiry — ${safeName}`,
      text,
      attachments: files.map(file => ({
        filename: cleanFilename(file.originalname),
        content: file.buffer,
        contentType: file.mimetype
      }))
    });

    return res.json({ ok: true, message: 'Thanks! Your project information has been sent to Side Decks.' });
  } catch (error) {
    console.error('Quote submission failed:', error);
    return res.status(500).json({ ok: false, message: 'We could not send your request. Please try again or call Side Decks.' });
  }
});

// Multer/Express upload errors are raised before the route handler's try/catch.
app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ ok: false, message: 'Each uploaded file must be 10 MB or smaller.' });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ ok: false, message: `Please choose no more than ${MAX_FILES} files.` });
    }
    return res.status(400).json({ ok: false, message: 'Please check the uploaded files and try again.' });
  }

  if (error) {
    console.error('Request error:', error);
    return res.status(400).json({ ok: false, message: 'One or more uploaded files are not supported. Use JPG, PNG, WEBP or PDF.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Side Decks website listening on port ${PORT}`);
});
