const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Connection Error:', err.message));

// ============================================================
// Contact Message Schema & Model
// ============================================================
const messageSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// ============================================================
// ROUTES
// ============================================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Portfolio Backend is running 🚀' });
});

// POST - Contact Form Submission
app.post('/api/contact', async (req, res) => {
  try {
    const { fullname, email, message } = req.body;

    if (!fullname || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Save to MongoDB
    const newMessage = new Message({ fullname, email, message });
    await newMessage.save();

    // Send Email Notifications
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // 1. Alert to YOU (The Portfolio Owner)
      const mailOptionsToOwner = {
        from: process.env.EMAIL_USER,
        to: 'dhyeybarbhaya@gmail.com',
        subject: `Portfolio Contact - ${fullname}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${fullname}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong> ${message}</p>
          <hr />
          <p><em>Sent from your portfolio website</em></p>
        `,
      };

      // 2. Auto-reply to the SENDER (The Person Contacting You)
      const mailOptionsToSender = {
        from: process.env.EMAIL_USER,
        to: email, // The dynamic email address they provided
        subject: `Thank you for contacting Dhyey Barbhaya!`,
        html: `
          <h2>Hello ${fullname},</h2>
          <p>Thank you for reaching out to me through my portfolio website!</p>
          <p>I have received your message and will get back to you as soon as possible.</p>
          <br />
          <p><strong>Here is a copy of what you sent:</strong></p>
          <blockquote style="border-left: 4px solid #fdbf5c; padding-left: 10px; color: #555;">
            ${message}
          </blockquote>
          <br />
          <p>Best Regards,</p>
          <p><strong>Dhyey Barbhaya</strong></p>
          <p>Full Stack Developer</p>
        `,
      };

      // Send both emails simultaneously
      await Promise.all([
        transporter.sendMail(mailOptionsToOwner),
        transporter.sendMail(mailOptionsToSender)
      ]);
    }

    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// GET - All Messages (for admin)
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
