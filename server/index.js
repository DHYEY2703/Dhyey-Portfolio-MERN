const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Track connected socket clients
io.on('connection', (socket) => {
  console.log('⚡ Admin connected to Live WebSocket:', socket.id);
  socket.on('disconnect', () => {
    console.log('❌ Admin disconnected from WebSocket:', socket.id);
  });
});

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

// POST - AI Chatbot
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const systemPrompt = `You are Dhyey's AI Assistant — a warm, enthusiastic, and knowledgeable chatbot embedded in the personal portfolio website of Dhyey Barbhaya. Your job is to impress visitors and help them learn about Dhyey.

## About Dhyey Barbhaya
- Full Stack Developer from Vadodara, Gujarat, India.
- Born on July 2, 2004. Currently pursuing his education while building real-world projects.
- Passionate about creating scalable, high-performance web applications with clean code and stunning user interfaces.

## Technical Skills
- **Frontend**: React.js, Next.js, TypeScript, Three.js (3D web), Framer Motion, HTML5, CSS3
- **Backend**: Node.js, Express.js, Python, REST APIs, WebSockets (Socket.io)
- **Databases**: MongoDB, Mongoose
- **AI/ML**: AI microservice integrations, predictive analytics, sales forecasting models
- **DevOps**: Docker, Git/GitHub, CI/CD
- **Other**: JWT Auth, Nodemailer, Recharts, React Three Fiber

## Key Projects (describe these in detail when asked)
1. **RMS ERP System** — A comprehensive enterprise resource planning system for restaurant management. Full stack MERN app with role-based access control, inventory management, and real-time order tracking.
2. **AI Sales Forecaster** — An intelligent application that uses AI/ML models to predict future sales trends based on historical data. Features interactive dashboards with Recharts visualizations.
3. **Attendance Management System (AMS)** — A full-stack system for schools/colleges with features like class-based attendance reports, multi-language support (English, Hindi, Gujarati), and a forgot password flow with email-based OTP reset.
4. **MERN 3D Portfolio** — This very website! A stunning portfolio featuring 3D particle backgrounds, custom cursors, sound effects, an AI chatbot (you!), admin dashboard, blog CMS, and real-time visitor analytics.
5. **NovaHardware Store (E-commerce)** — A full e-commerce platform with product catalog, cart system, payment integration, and admin dashboard with order management.
6. **Feedback System** — A dynamic feedback collection and analytics system with PDF/Excel export functionality and an admin dashboard.

## Contact Information
- Email: dhyeybarbhaya@gmail.com
- Phone: +91 8347938469
- GitHub: https://github.com/DHYEY2703
- Location: Vadodara, Gujarat, India

## Response Guidelines
- Always give complete, well-structured answers. Never cut off mid-sentence.
- Keep responses extremely punchy and concise (1-3 sentences). This ensures blazing fast reply latency.
- Be enthusiastic and positive about Dhyey's work. Highlight his strengths naturally.
- Use a friendly, professional tone — like a helpful colleague introducing you to Dhyey.
- When asked about projects, describe them with specific technologies and features.
- If asked unrelated questions (politics, random trivia, etc.), politely redirect.
- Never make up information. Stick to the facts above.

## Navigation Commands (Action Skills)
If the user explicitly asks to view, go to, or open a specific section (Resume, Portfolio, Blog, Contact, About), or if your answer heavily recommends they check out that page, you MUST include a special navigation tag at the VERY END of your response.
Format: <NAVIGATE:page_name>
Valid page names are exactly one of: about, resume, portfolio, blog, contact.
For example, if they ask to see your resume, reply: "Sure thing! Let me take you directly to Dhyey's resume right now. <NAVIGATE:resume>"`;

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      systemInstruction: systemPrompt
    });

    // Map conversation history format if passed from frontend
    const history = (conversationHistory || []).map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chatSession = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 250,
        temperature: 0.8,
      }
    });

    const result = await chatSession.sendMessageStream(message);

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    for await (const chunk of result.stream) {
      if (chunk.text) {
        const text = chunk.text();
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }
    
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Gemini API Error:', error.message || error);
    // If headers already sent, we cannot res.status(500)
    if (!res.headersSent) {
      res.status(500).json({ error: 'AI is temporarily unavailable.' });
    } else {
      res.end();
    }
  }
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

    // Fire WebSocket Event to Connected Admins
    io.emit('new_message', { 
      fullname, 
      email, 
      message, 
      createdAt: newMessage.createdAt 
    });

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
        subject: `New Lead: ${fullname} via Portfolio`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #1a1a1a; color: #f0f0f0; border-radius: 12px; border: 1px solid #333; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);">
            <div style="text-align: center; border-bottom: 2px solid #00ff88; padding-bottom: 20px; margin-bottom: 25px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Contact Submission <span style="color: #00ff88;">🚀</span></h1>
            </div>
            
            <p style="font-size: 16px; color: #d6d6d6;">You have received a new message from a visitor on your portfolio website!</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #333; color: #00ff88; font-weight: bold; width: 100px;">Name:</td>
                <td style="padding: 12px; border-bottom: 1px solid #333; color: #ffffff;">${fullname}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #333; color: #00ff88; font-weight: bold;">Email:</td>
                <td style="padding: 12px; border-bottom: 1px solid #333;">
                  <a href="mailto:${email}" style="color: #fdbf5c; text-decoration: none;">${email}</a>
                </td>
              </tr>
            </table>

            <div style="background-color: #242424; padding: 20px; border-left: 4px solid #00ff88; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0; font-size: 13px; color: #aaaaaa; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Message:</p>
              <p style="margin: 0; font-size: 16px; color: #ffffff; white-space: pre-wrap; line-height: 1.5;">"${message}"</p>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="mailto:${email}" style="display: inline-block; background-color: #00ff88; color: #1a1a1a; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 6px; font-size: 15px;">Reply to ${fullname}</a>
            </div>
          </div>
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

// ============================================================
// Secure Admin Authentication & JWT
// ============================================================
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret123';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'dhyey@admin123';

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: 'Invalid admin credentials' });
  }
});

// Middleware to verify JWT token
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') throw new Error();
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};


// ============================================================
// Live Visitor Tracking Schema
// ============================================================
const visitorSchema = new mongoose.Schema({
  userAgent: String,
  date: { type: Date, default: Date.now }
});
const Visitor = mongoose.model('Visitor', visitorSchema);

// POST - Log a new visit
app.post('/api/visitors', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    // Simple anti-spam: Only log one visit per IP/UserAgent per day (in a real app, use session or IP hash)
    // For portfolio purposes, we'll log it if the user agent is provided and not empty
    if(req.body.userAgent) {
       await new Visitor({ userAgent: req.body.userAgent }).save();
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log visitor' });
  }
});

// GET - Visitor Analytics Data (Last 7 Days) for Recharts -> Protected
app.get('/api/visitors/analytics', verifyAdmin, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const visitors = await Visitor.find({
      date: { $gte: sevenDaysAgo }
    });

    // Aggregate by day of week
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const analytics = [];
    
    // Initialize last 7 days with 0
    for(let i=6; i>=0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      analytics.push({ name: days[d.getDay()], dateString: d.toDateString(), visitors: 0 });
    }

    visitors.forEach(v => {
      const vDate = new Date(v.date).toDateString();
      const match = analytics.find(a => a.dateString === vDate);
      if(match) match.visitors++;
    });

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});


// GET - All Messages (for admin) -> Protected
app.get('/api/messages', verifyAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// ============================================================
// Blog Post Schema & Model
// ============================================================
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  text: { type: String, required: true },
  img: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Blog = mongoose.model('Blog', blogSchema);

// GET - All Blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// POST - Add new Blog (for admin CMS) -> Protected
app.post('/api/blogs', verifyAdmin, async (req, res) => {
  try {
    const { title, category, text, img } = req.body;
    if (!title || !category || !text || !img) {
      return res.status(400).json({ error: 'All blog fields are required' });
    }
    const newBlog = new Blog({ title, category, text, img });
    await newBlog.save();
    res.status(201).json({ success: true, message: 'Blog created successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// DELETE - Delete Blog (for admin CMS) -> Protected
app.delete('/api/blogs/:id', verifyAdmin, async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

// ============================================================
// START SERVER
// ============================================================
server.listen(PORT, () => {
  console.log(`🚀 Server with WebSockets running on http://localhost:${PORT}`);
});
