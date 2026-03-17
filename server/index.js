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
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #1e1e1f; color: #d6d6d6; border-radius: 12px; border: 1px solid #383838; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);">
            <div style="text-align: center; border-bottom: 2px solid #fdbf5c; padding-bottom: 20px; margin-bottom: 25px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 600;">Message Received <span style="color: #fdbf5c;">✓</span></h1>
            </div>
            
            <p style="font-size: 16px; color: #ffffff;">Hello <strong>${fullname}</strong>,</p>
            
            <p style="font-size: 15px; line-height: 1.6;">
              Thank you for reaching out through my portfolio website! I have successfully received your message and truly appreciate your interest.
            </p>
            
            <p style="font-size: 15px; line-height: 1.6;">
              I will review your inquiry and get back to you as soon as possible.
            </p>
            
            <div style="background-color: #282829; padding: 20px; border-left: 4px solid #fdbf5c; border-radius: 6px; margin: 30px 0;">
              <p style="margin: 0; font-size: 13px; color: #aaaaaa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Copy of your message:</p>
              <p style="margin: 0; font-size: 15px; color: #ffffff; font-style: italic; white-space: pre-wrap;">"${message}"</p>
            </div>
            
            <div style="margin-top: 35px; padding-top: 25px; border-top: 1px solid #383838;">
              <p style="margin: 0; font-size: 15px; color: #aaaaaa;">Best Regards,</p>
              <p style="margin: 8px 0 0 0; font-size: 20px; color: #fdbf5c; font-weight: bold; letter-spacing: 0.5px;">Dhyey Barbhaya</p>
              <a href="https://github.com/DHYEY2703" style="display: inline-block; margin-top: 12px; color: #fdbf5c; text-decoration: none; font-size: 14px; border: 1px solid #fdbf5c; padding: 6px 12px; border-radius: 4px;">View My Work</a>
            </div>
          </div>
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
