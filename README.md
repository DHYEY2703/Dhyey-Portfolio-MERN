# Dhyey Barbhaya — Enterprise MERN Stack Portfolio 🚀

A high-performance, interactive, and fully-featured personal portfolio web application built from the ground up to showcase mastery of full-stack engineering. 

This is not a static site; it is a **dynamic, Dockerized SaaS-grade architecture** featuring a custom Content Management System (CMS), live WebSocket connections, and advanced MongoDB analytics.

## ✨ Premium Features

### 🔐 Secure Backend & Admin Dashboard
- **Custom Admin Panel:** Secured by JSON Web Tokens (JWT) with strict route protection middleware.
- **RESTful API:** Robust Node/Express endpoints connected to MongoDB.
- **Content Management System (CMS):** Create, publish, and manage blog posts directly from the private dashboard.
- **Live Traffic Analytics:** Built-in unique session visitor tracking rendered onto the dashboard via `recharts`.

### ⚡ Real-Time WebSockets
- **Live Event Driven Notifications:** Integrated `Socket.io` connection streams instantly alerts the admin dashboard whenever a recruiter sends a contact form message.

### ✉️ Automated Messaging System
- **Nodemailer Integration:** Background job processing to instantly send rich HTML auto-replies to visitors and simultaneous notification emails to the owner.

### 🎨 State-of-the-Art Frontend
- **Built with React + Vite + TypeScript** for maximum performance and strict type safety.
- **Three.js Integrations:** 3D interactive particle animations and a physics-based tech stack sphere.
- **Dynamic GitHub Graph:** Live fetches and renders the user's continuous GitHub code contribution history using a styled heatmap.
- **Custom Aesthetic:** Global custom responsive cursor, immersive Framer Motion page transitions, and subtle ambient sound design logic.
- **Interactive Chatbot:** A collapsible AI-style chat widget interface for guiding visitors.

### 🐳 Advanced DevOps & SEO
- **Full Dockerization:** Production-ready `Dockerfile` multi-stage builds (Nginx Alpine) + complete orchestration via `docker-compose.yml`.
- **Advanced SEO Optimization:** Asynchronous dynamic meta-tagging via `react-helmet-async`, structured `sitemap.xml`, and strict crawler instructions.

---

## 🚀 Getting Started Locally

### Environment Setup
Create a `.env` file in the `/server` directory with the following variables:
```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
JWT_SECRET=super_secret_jwt_key
ADMIN_PASSWORD=your_secure_password
```

### Option A: Standard Initialization
**1. Start the Backend API**
```bash
cd server
npm install
npm run dev
```
**2. Start the Frontend Application**
```bash
npm install
npm run dev
```

### Option B: Docker Containers
If you have Docker Desktop installed, you can spin up the entire architecture (DB, Frontend, API) natively:
```bash
docker compose up -d --build
```

---

## 🛠️ Technology Stack Breakdown

| Layer | Technologies |
| :--- | :--- |
| **Frontend Setup** | React (Vite), TypeScript, HTML5, CSS3, Framer Motion |
| **Backend & APIs** | Node.js, Express.js |
| **Database & ODM** | MongoDB, Mongoose |
| **Authentication** | JSON Web Tokens (JWT), bcrypt |
| **Real-Time Data** | Socket.IO, Recharts |
| **Email Service**  | Nodemailer |
| **Graphics**       | Three.js (@react-three/fiber), Canvas Confetti |
| **DevOps**         | Docker, Docker Compose, Nginx |

---

## ⚖️ License (Proprietary)

**Copyright © 2026 Dhyey Barbhaya. All Rights Reserved.**

This software is the proprietary property of Dhyey Barbhaya. It is intended for portfolio demonstration viewings only. It cannot be used, modified, sub-licensed, or re-distributed by individuals or organizations without express written consent. See the `LICENSE` file for more details.
