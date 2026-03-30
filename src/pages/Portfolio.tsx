import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [selectActive, setSelectActive] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{ title: string; category: string; img: string; link: string; description: string; techStack: string[]; liveUrl?: string } | null>(null);

  const projects = [
    { 
      title: 'RMS ERP System', 
      category: 'Full Stack', 
      img: '/assets/images/project-1.jpg',
      link: 'https://github.com/DHYEY2703/RMS-ERP',
      description: 'A comprehensive Enterprise Resource Planning (ERP) system designed to streamline operations, manage resources, and improve organizational efficiency. It features role-based access control, real-time analytics, and automated reporting.',
      techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS']
    },
    { 
      title: 'AI Sales Forecaster', 
      category: 'AI Integration', 
      img: '/assets/images/project-2.png',
      link: 'https://github.com/DHYEY2703/chatify-by-dhyey',
      description: 'An intelligent sales forecasting tool that leverages machine learning algorithms to predict future sales trends based on historical data. Built with an intuitive dashboard for actionable business insights.',
      techStack: ['Python', 'Flask', 'React', 'Scikit-learn', 'Pandas']
    },
    { 
      title: 'Attendance Management System (AMS)', 
      category: 'Full Stack', 
      img: '/assets/images/project-3.jpg',
      link: 'https://github.com/DHYEY2703/AMS',
      description: 'A robust attendance tracking system with real-time logging, reporting features, and an administrative dashboard. Designed to automate the attendance process for educational institutions and small businesses.',
      techStack: ['MERN Stack', 'JWT Auth', 'Material UI']
    },
    { 
      title: 'MERN 3D Portfolio', 
      category: 'Web Development', 
      img: '/assets/images/project-4.png',
      link: 'https://github.com/DHYEY2703/Dhyey-Portfolio-MERN',
      description: 'This very portfolio! A cutting-edge personal website featuring 3D WebGL visualizations, autonomous AI voice assistance, real-time WebSockets, and a hidden interactive physics-driven game engine.',
      techStack: ['React', 'Three.js', 'Framer Motion', 'Node.js', 'Socket.IO'],
      liveUrl: 'https://dhyeybarbhaya.com'
    },
    { 
      title: 'E-commerce API', 
      category: 'Backend', 
      img: '/assets/images/project-5.png',
      link: 'https://github.com/DHYEY2703/NovaHardware-Store',
      description: 'A highly scalable, production-ready REST API for an e-commerce platform. Includes features like product management, secure cart transactions, JWT authentication, and automated email receipts.',
      techStack: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'Stripe API']
    },
    { 
      title: 'Dynamic Dashboard', 
      category: 'Web Development', 
      img: '/assets/images/project-6.png',
      link: 'https://github.com/DHYEY2703/Feeback-System',
      description: 'A dynamic feedback management dashboard allowing administrators to track user feedback, analyze sentiment trends, and export analytical reports in real-time.',
      techStack: ['React', 'Chart.js', 'Node.js', 'Express']
    }
  ];

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <article className="portfolio active" data-page="portfolio">
      <header>
        <h2 className="h2 article-title">Portfolio</h2>
      </header>

      <section className="projects">
        <ul className="filter-list">
          <li className="filter-item">
            <button className={filter === 'All' ? 'active' : ''} onClick={() => setFilter('All')}>All</button>
          </li>
          <li className="filter-item">
            <button className={filter === 'Full Stack' ? 'active' : ''} onClick={() => setFilter('Full Stack')}>Full Stack</button>
          </li>
          <li className="filter-item">
            <button className={filter === 'Web Development' ? 'active' : ''} onClick={() => setFilter('Web Development')}>Web Development</button>
          </li>
          <li className="filter-item">
            <button className={filter === 'Backend' ? 'active' : ''} onClick={() => setFilter('Backend')}>Backend</button>
          </li>
          <li className="filter-item">
            <button className={filter === 'AI Integration' ? 'active' : ''} onClick={() => setFilter('AI Integration')}>AI Integration</button>
          </li>
        </ul>

        <div className="filter-select-box">
          <button className={`filter-select ${selectActive ? 'active' : ''}`} onClick={() => setSelectActive(!selectActive)}>
            <div className="select-value">{filter === 'All' ? 'Select category' : filter}</div>
            <div className="select-icon">
                    {/*@ts-expect-error: ion-icon custom component*/}
              <ion-icon name="chevron-down"></ion-icon>
            </div>
          </button>

          <ul className="select-list">
            <li className="select-item">
              <button onClick={() => { setFilter('All'); setSelectActive(false); }}>All</button>
            </li>
            <li className="select-item">
              <button onClick={() => { setFilter('Full Stack'); setSelectActive(false); }}>Full Stack</button>
            </li>
            <li className="select-item">
              <button onClick={() => { setFilter('Web Development'); setSelectActive(false); }}>Web Development</button>
            </li>
            <li className="select-item">
              <button onClick={() => { setFilter('Backend'); setSelectActive(false); }}>Backend</button>
            </li>
            <li className="select-item">
              <button onClick={() => { setFilter('AI Integration'); setSelectActive(false); }}>AI Integration</button>
            </li>
          </ul>
        </div>

        <ul className="project-list">
          <AnimatePresence>
            {filteredProjects.map((project, index) => (
              <motion.li 
                layout
                initial={{ opacity: 0, y: 80, scale: 0.7, rotateZ: Math.random() * 10 - 5 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateZ: 0 }}
                exit={{ opacity: 0, y: 50, scale: 0.8 }}
                transition={{ 
                  duration: 0.6, 
                  delay: index * 0.12, // Sequential staggered dealing delay 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15 
                }}
                className="project-item active" 
                key={index}
                onClick={() => setSelectedProject(project)}
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <figure className="project-img">
                    <div className="project-item-icon-box">
                      {/*@ts-expect-error: ion-icon custom component*/}
                      <ion-icon name="eye-outline"></ion-icon>
                    </div>
                    <img src={project.img} alt={project.title} loading="lazy" />
                  </figure>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-category">{project.category}</p>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </section>

      {/* Dynamic Slide-Out Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="modal-container active" style={{ zIndex: 1000, pointerEvents: 'all' }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="overlay active" 
              onClick={() => setSelectedProject(null)} 
            ></motion.div>
            
            <motion.section 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                width: '100%',
                maxWidth: '500px',
                height: '100vh',
                background: 'var(--eerie-black-2)',
                borderLeft: '1px solid var(--jet)',
                padding: '30px',
                zIndex: 1001,
                overflowY: 'auto',
                boxShadow: 'var(--shadow-5)'
              }}
            >
              <button 
                onClick={() => setSelectedProject(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'var(--onyx)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  color: 'var(--orange-yellow-crayola)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                {/*@ts-expect-error: ion-icon custom component*/}
                <ion-icon name="close-outline" style={{ fontSize: '24px' }}></ion-icon>
              </button>

              <div style={{ marginTop: '40px' }}>
                <figure style={{ borderRadius: '16px', overflow: 'hidden', marginBottom: '20px', boxShadow: 'var(--shadow-2)' }}>
                  <img src={selectedProject.img} alt={selectedProject.title} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                </figure>
                
                <h3 className="h2" style={{ color: 'var(--white-2)', marginBottom: '5px' }}>{selectedProject.title}</h3>
                <p style={{ color: 'var(--orange-yellow-crayola)', fontSize: '14px', marginBottom: '20px' }}>{selectedProject.category}</p>
                
                <p style={{ color: 'var(--light-gray)', lineHeight: '1.6', marginBottom: '20px' }}>
                  {selectedProject.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '30px' }}>
                  {selectedProject.techStack.map((tech, idx) => (
                    <span key={idx} style={{ 
                      background: 'var(--onyx)', 
                      color: 'var(--orange-yellow-crayola)', 
                      padding: '5px 12px', 
                      borderRadius: '8px', 
                      fontSize: '13px', 
                      fontWeight: 500,
                      border: '1px solid var(--jet)'
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  {selectedProject.liveUrl && (
                    <a 
                      href={selectedProject.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="form-btn"
                      style={{ flex: 1, textDecoration: 'none', background: 'var(--orange-yellow-crayola)', color: 'var(--eerie-black-1)' }}
                    >
                      {/*@ts-expect-error: ion-icon custom component*/}
                      <ion-icon name="globe-outline"></ion-icon>
                      <span style={{ color: 'var(--eerie-black-1)' }}>Live Demo</span>
                    </a>
                  )}
                  <a 
                    href={selectedProject.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="form-btn"
                    style={{ flex: 1, textDecoration: 'none' }}
                  >
                    {/*@ts-expect-error: ion-icon custom component*/}
                    <ion-icon name="logo-github"></ion-icon>
                    <span>View Repository</span>
                  </a>
                </div>
              </div>
            </motion.section>
          </div>
        )}
      </AnimatePresence>
    </article>
  );
};

export default Portfolio;
