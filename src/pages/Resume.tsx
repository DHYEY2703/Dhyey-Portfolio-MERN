import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const skillsData = [
  { subject: 'React', val: 90, fullMark: 100 },
  { subject: 'Node.js', val: 85, fullMark: 100 },
  { subject: 'MongoDB', val: 80, fullMark: 100 },
  { subject: 'TypeScript', val: 85, fullMark: 100 },
  { subject: 'HTML/CSS', val: 95, fullMark: 100 },
  { subject: 'Python', val: 75, fullMark: 100 },
];

const Resume: React.FC = () => {
  return (
    <article className="resume active" data-page="resume">
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h2 className="h2 article-title">Resume</h2>
        <a 
          href="/assets/resume/DHYEY_MERN_RESUME.pdf" 
          download="DHYEY_MERN_RESUME.pdf"
          className="form-btn"
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '10px 20px',
            fontSize: '14px',
            textDecoration: 'none',
            pointerEvents: 'auto',
            cursor: 'pointer',
            width: 'max-content',
            marginTop: '15px',
          }}
        >
          {/*@ts-expect-error: ion-icon is a custom web component*/}
          <ion-icon name="download-outline"></ion-icon>
          <span>Download CV</span>
        </a>
      </header>

      <section className="timeline">
        <div className="title-wrapper">
          <div className="icon-box">
            {/*@ts-expect-error: ion-icon is a custom web component*/}
            <ion-icon name="book-outline"></ion-icon>
          </div>
          <h3 className="h3">Education</h3>
        </div>

        <ol className="timeline-list">
          {[
            { title: 'Murlidhar School', year: '2008 — 2010', desc: 'The foundation of my early learning, where curiosity and creativity were nurtured. A place that shaped my first steps towards knowledge and growth.' },
            { title: 'Pathak vidhya mandir', year: '2011 — 2015', desc: 'Where I built my academic foundation, embraced challenges, and grew with discipline and dedication. A place that inspired my journey of knowledge and self-discovery.' },
            { title: 'Navyug School', year: '2016 — 2018', desc: 'A pivotal chapter in my education, where I honed my skills and developed a strong sense of responsibility. A place that prepared me for the challenges ahead.' }
          ].map((item, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, y: 70, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.15, type: 'spring', stiffness: 200, damping: 20 }}
              className="timeline-item"
            >
              <h4 className="h4 timeline-item-title">{item.title}</h4>
              <span>{item.year}</span>
              <p className="timeline-text">{item.desc}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="timeline">
        <div className="title-wrapper">
          <div className="icon-box">
            {/*@ts-expect-error: ion-icon is a custom web component*/}
            <ion-icon name="briefcase-outline"></ion-icon>
          </div>
          <h3 className="h3">Experience</h3>
        </div>

        <ol className="timeline-list">
          {[
            { title: 'Full Stack Developer', year: '2023 — Present', desc: 'Developed scalable MERN stack web applications and ERP solutions. Integrated AI components for predictive analysis, implemented modern design frameworks, and utilized responsive frontend technologies.' },
            { title: 'Frontend Developer', year: '2021 — 2023', desc: 'Specialized in React, building dynamic UI components, state management using Redux, and ensuring mobile-first responsive design across enterprise applications.' }
          ].map((item, index) => (
            <motion.li 
              key={index}
              initial={{ opacity: 0, y: 70, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + (index * 0.15), type: 'spring', stiffness: 200, damping: 20 }}
              className="timeline-item"
            >
              <h4 className="h4 timeline-item-title">{item.title}</h4>
              <span>{item.year}</span>
              <p className="timeline-text">{item.desc}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      <section className="skill">
        <h3 className="h3 skills-title">Technical Skills</h3>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.6, type: 'spring', bounce: 0.4 }}
          className="content-card" 
          style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsData}>
              <PolarGrid stroke="var(--jet)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--white-2)', fontSize: 13 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--light-gray)' }} />
              <Radar name="Proficiency" dataKey="val" stroke="#fdbf5c" fill="#fdbf5c" fillOpacity={0.6} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--eerie-black-1)', border: '1px solid var(--jet)', borderRadius: '8px' }}
                itemStyle={{ color: '#fdbf5c' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </section>
    </article>
  );
};

export default Resume;
