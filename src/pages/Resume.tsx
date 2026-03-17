import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

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
          <li className="timeline-item">
            <h4 className="h4 timeline-item-title">Murlidhar School</h4>
            <span>2008 — 2010</span>
            <p className="timeline-text">
              The foundation of my early learning, where curiosity and creativity were nurtured. A place that shaped my first steps towards knowledge and growth.
            </p>
          </li>
          <li className="timeline-item">
            <h4 className="h4 timeline-item-title">Pathak vidhya mandir</h4>
            <span>2011 — 2015</span>
            <p className="timeline-text">
              Where I built my academic foundation, embraced challenges, and grew with discipline and dedication. A place that inspired my journey of knowledge and self-discovery.
            </p>
          </li>
          <li className="timeline-item">
            <h4 className="h4 timeline-item-title">Navyug School</h4>
            <span>2016 — 2018</span>
            <p className="timeline-text">
              A pivotal chapter in my education, where I honed my skills and developed a strong sense of responsibility. A place that prepared me for the challenges ahead.
            </p>
          </li>
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
          <li className="timeline-item">
            <h4 className="h4 timeline-item-title">Full Stack Developer</h4>
            <span>2023 — Present</span>
            <p className="timeline-text">
              Developed scalable MERN stack web applications and ERP solutions. Integrated AI components for predictive analysis, implemented modern design frameworks, and utilized responsive frontend technologies.
            </p>
          </li>
          <li className="timeline-item">
            <h4 className="h4 timeline-item-title">Frontend Developer</h4>
            <span>2021 — 2023</span>
            <p className="timeline-text">
              Specialized in React, building dynamic UI components, state management using Redux, and ensuring mobile-first responsive design across enterprise applications.
            </p>
          </li>
        </ol>
      </section>

      <section className="skill">
        <h3 className="h3 skills-title">Technical Skills</h3>
        
        <div className="content-card" style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
        </div>
      </section>
    </article>
  );
};

export default Resume;
