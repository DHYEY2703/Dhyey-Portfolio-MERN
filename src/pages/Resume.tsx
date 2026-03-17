import React from 'react';

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
          }}
        >
          {/*@ts-ignore*/}
          <ion-icon name="download-outline"></ion-icon>
          <span>Download CV</span>
        </a>
      </header>

      <section className="timeline">
        <div className="title-wrapper">
          <div className="icon-box">
            {/*@ts-ignore*/}
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
            {/*@ts-ignore*/}
            <ion-icon name="book-outline"></ion-icon>
          </div>
          <h3 className="h3">Experience</h3>
        </div>

        <ol className="timeline-list">
          <li className="timeline-item">
            <h4 className="h4 timeline-item-title">Creative director</h4>
            <span>2015 — Present</span>
            <p className="timeline-text">
              Nemo enim ipsam voluptatem blanditiis praesentium voluptum delenit atque corrupti, quos dolores et qvuas molestias exceptur.
            </p>
          </li>
          <li className="timeline-item">
            <h4 className="h4 timeline-item-title">Art director</h4>
            <span>2013 — 2015</span>
            <p className="timeline-text">
              Nemo enims ipsam voluptatem, blanditiis praesentium voluptum delenit atque corrupti, quos dolores et quas molestias exceptur.
            </p>
          </li>
          <li className="timeline-item">
            <h4 className="h4 timeline-item-title">Web designer</h4>
            <span>2010 — 2013</span>
            <p className="timeline-text">
              Nemo enims ipsam voluptatem, blanditiis praesentium voluptum delenit atque corrupti, quos dolores et quas molestias exceptur.
            </p>
          </li>
        </ol>
      </section>

      <section className="skill">
        <h3 className="h3 skills-title">My skills</h3>
        <ul className="skills-list content-card">
          <li className="skills-item">
            <div className="title-wrapper">
              <h5 className="h5">Web design</h5>
              <data value="80">80%</data>
            </div>
            <div className="skill-progress-bg">
              <div className="skill-progress-fill" style={{ width: '80%' }}></div>
            </div>
          </li>
          <li className="skills-item">
            <div className="title-wrapper">
              <h5 className="h5">Graphic design</h5>
              <data value="70">70%</data>
            </div>
            <div className="skill-progress-bg">
              <div className="skill-progress-fill" style={{ width: '70%' }}></div>
            </div>
          </li>
          <li className="skills-item">
            <div className="title-wrapper">
              <h5 className="h5">Branding</h5>
              <data value="90">90%</data>
            </div>
            <div className="skill-progress-bg">
              <div className="skill-progress-fill" style={{ width: '90%' }}></div>
            </div>
          </li>
          <li className="skills-item">
            <div className="title-wrapper">
              <h5 className="h5">WordPress</h5>
              <data value="50">50%</data>
            </div>
            <div className="skill-progress-bg">
              <div className="skill-progress-fill" style={{ width: '50%' }}></div>
            </div>
          </li>
        </ul>
      </section>
    </article>
  );
};

export default Resume;
