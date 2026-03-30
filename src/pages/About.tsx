import React, { useState } from 'react';
import TechStack3D from '../components/TechStack3D';
import { GitHubCalendar } from 'react-github-calendar';

const About: React.FC = () => {
  const [modalData, setModalData] = useState<{name: string, text: string, date: string, avatar: string} | null>(null);

  const testimonials = [
    {
      name: 'Rishav Desai',
      avatar: '/assets/images/avatar-1.png',
      date: '22 March, 2025',
      text: `"Dhyey built our internal ERP dashboard from scratch, and the result was incredible. He architected the entire backend API, integrated real-time WebSocket notifications, and delivered a React frontend that our team actually enjoys using. His full-stack expertise is the real deal — highly recommended."`
    },
    {
      name: 'Kashish Dhulia',
      avatar: '/assets/images/avatar-2.png',
      date: '08 January, 2025',
      text: `"Working with Dhyey on our AI-powered sales forecasting tool was an absolute pleasure. He seamlessly integrated machine learning models with a clean Node.js API and a beautiful React dashboard. His ability to bridge AI and web development is rare and incredibly valuable."`
    },
    {
      name: 'Poonam Makhija',
      avatar: '/assets/images/avatar-3.png',
      date: '15 November, 2024',
      text: `"Dhyey delivered a fully Dockerized attendance management platform for our organization. From MongoDB schema design to Nginx deployment configs, he handled every layer of the stack with confidence. The system has been running flawlessly in production for months."`
    },
    {
      name: 'Devanshu Jain',
      avatar: '/assets/images/avatar-4.png',
      date: '03 August, 2024',
      text: `"Dhyey's attention to detail is exceptional. He redesigned our e-commerce backend API with proper JWT authentication, role-based access control, and automated email notifications. The codebase he delivered was clean, well-documented, and production-ready from day one."`
    }
  ];

  return (
    <article className="about active" data-page="about">
      <header>
        <h2 className="h2 article-title">About me</h2>
      </header>

      <section className="about-text">
        <p>
          Hi, I'm Dhyey Barbhaya, a passionate Full Stack Developer specializing in the MERN stack. I thrive on building scalable, performant web applications and intuitive interfaces that solve real-world problems. With a deep technical foundation in React, Node.js, Document Databases, and TypeScript, my focus is always on engineering clean, maintainable code to deliver outstanding digital experiences.
        </p>
        <p>
          Beyond traditional web development, I have a strong interest in integrating AI microservices for predictive analysis and crafting intelligent backend architectures. Whether I'm building a comprehensive ERP system, developing robust dynamic dashboards, or designing modern tech-forward interfaces, I bring a detail-oriented, solution-driven mindset to every project I tackle. Let's build something amazing together.
        </p>
      </section>

      <TechStack3D />

      <section className="service">
        <h3 className="h3 service-title">What I'm doing</h3>
        <ul className="service-list">
          <li className="service-item">
            <div className="service-icon-box">
              <img src="/assets/images/icon-dev.svg" alt="Full Stack Development icon" width="40" />
            </div>
            <div className="service-content-box">
              <h4 className="h4 service-item-title">Full Stack Development</h4>
              <p className="service-item-text">
                End-to-end MERN stack engineering — from React frontends with Framer Motion animations to Express.js APIs with MongoDB, Socket.IO, and real-time data pipelines.
              </p>
            </div>
          </li>
          <li className="service-item">
            <div className="service-icon-box">
              <img src="/assets/images/icon-design.svg" alt="AI Integration icon" width="40" />
            </div>
            <div className="service-content-box">
              <h4 className="h4 service-item-title">AI Integration</h4>
              <p className="service-item-text">
                Integrating Large Language Models (Google Gemini, OpenAI) into production applications — voice assistants, SSE streaming, intelligent automation, and predictive analytics.
              </p>
            </div>
          </li>
          <li className="service-item">
            <div className="service-icon-box">
              <img src="/assets/images/icon-app.svg" alt="API Architecture icon" width="40" />
            </div>
            <div className="service-content-box">
              <h4 className="h4 service-item-title">API Architecture</h4>
              <p className="service-item-text">
                Designing secure, scalable RESTful APIs with JWT authentication, role-based access control, rate limiting, and automated email notification systems.
              </p>
            </div>
          </li>
          <li className="service-item">
            <div className="service-icon-box">
              <img src="/assets/images/icon-photo.svg" alt="Cloud & DevOps icon" width="40" />
            </div>
            <div className="service-content-box">
              <h4 className="h4 service-item-title">Cloud & DevOps</h4>
              <p className="service-item-text">
                Production-grade Docker containerization, multi-stage builds, Nginx reverse proxy configuration, and CI/CD deployment pipelines for zero-downtime releases.
              </p>
            </div>
          </li>
        </ul>
      </section>

      <section className="github-calendar" style={{ marginBottom: '30px' }}>
        <h3 className="h3 service-title">My GitHub Activity</h3>
        <div className="content-card" style={{ padding: '20px', display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
          <GitHubCalendar 
            username="DHYEY2703" 
            colorScheme="dark"
            theme={{
              light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
              dark: ['#1e1e1f', '#00441b', '#006d2c', '#2ca25f', '#00ff88']
            }}
            style={{ width: '100%' }}
          />
        </div>
      </section>

      <section className="testimonials">
        <h3 className="h3 testimonials-title">Testimonials</h3>
        <ul className="testimonials-list has-scrollbar">
          {testimonials.map((test, index) => (
            <li className="testimonials-item" key={index}>
              <div className="content-card" onClick={() => setModalData(test)}>
                <figure className="testimonials-avatar-box">
                  <img src={test.avatar} alt={test.name} width="60" />
                </figure>
                <h4 className="h4 testimonials-item-title">{test.name}</h4>
                <div className="testimonials-text">
                  <p>{test.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Testimonials Modal */}
      <div className={`modal-container ${modalData ? 'active' : ''}`} data-modal-container>
        <div className={`overlay ${modalData ? 'active' : ''}`} onClick={() => setModalData(null)} data-overlay></div>
        <section className="testimonials-modal">
          <button className="modal-close-btn" onClick={() => setModalData(null)}>
            {/*@ts-ignore*/}
            <ion-icon name="close-outline"></ion-icon>
          </button>
          
          {modalData && (
            <>
              <div className="modal-img-wrapper">
                <figure className="modal-avatar-box">
                  <img src={modalData.avatar} alt={modalData.name} width="80" />
                </figure>
                <img src="/assets/images/icon-quote.svg" alt="quote icon" />
              </div>
              <div className="modal-content">
                <h4 className="h3 modal-title">{modalData.name}</h4>
                <time dateTime={modalData.date}>{modalData.date}</time>
                <div>
                  <p>{modalData.text}</p>
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      <section className="clients">
        <h3 className="h3 clients-title">Technologies I Work With</h3>
        <ul className="clients-list has-scrollbar">
          <li className="clients-item">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" width="50" />
              <span style={{ color: 'var(--light-gray)', fontSize: '12px' }}>React</span>
            </div>
          </li>
          <li className="clients-item">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" width="50" />
              <span style={{ color: 'var(--light-gray)', fontSize: '12px' }}>Node.js</span>
            </div>
          </li>
          <li className="clients-item">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" alt="MongoDB" width="50" />
              <span style={{ color: 'var(--light-gray)', fontSize: '12px' }}>MongoDB</span>
            </div>
          </li>
          <li className="clients-item">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" width="50" />
              <span style={{ color: 'var(--light-gray)', fontSize: '12px' }}>TypeScript</span>
            </div>
          </li>
          <li className="clients-item">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" width="50" />
              <span style={{ color: 'var(--light-gray)', fontSize: '12px' }}>Docker</span>
            </div>
          </li>
          <li className="clients-item">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg" alt="Three.js" width="50" style={{ filter: 'invert(1)' }} />
              <span style={{ color: 'var(--light-gray)', fontSize: '12px' }}>Three.js</span>
            </div>
          </li>
          <li className="clients-item">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg" alt="Nginx" width="50" />
              <span style={{ color: 'var(--light-gray)', fontSize: '12px' }}>Nginx</span>
            </div>
          </li>
          <li className="clients-item">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" width="50" />
              <span style={{ color: 'var(--light-gray)', fontSize: '12px' }}>Git</span>
            </div>
          </li>
        </ul>
      </section>
    </article>
  );
};

export default About;
