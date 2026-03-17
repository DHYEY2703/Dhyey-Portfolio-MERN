import React, { useState } from 'react';

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [selectActive, setSelectActive] = useState(false);

  const projects = [
    { 
      title: 'RMS ERP System', 
      category: 'Full Stack', 
      img: '/assets/images/project-1.jpg',
      link: 'https://github.com/DHYEY2703'
    },
    { 
      title: 'AI Sales Forecaster', 
      category: 'AI Integration', 
      img: '/assets/images/project-2.png',
      link: 'https://github.com/DHYEY2703'
    },
    { 
      title: 'Attendance Management', 
      category: 'Full Stack', 
      img: '/assets/images/project-3.jpg',
      link: 'https://github.com/DHYEY2703'
    },
    { 
      title: 'MERN 3D Portfolio', 
      category: 'Web Development', 
      img: '/assets/images/project-4.png',
      link: 'https://github.com/DHYEY2703'
    },
    { 
      title: 'E-commerce API', 
      category: 'Backend', 
      img: '/assets/images/project-5.png',
      link: 'https://github.com/DHYEY2703'
    },
    { 
      title: 'Dynamic Dashboard', 
      category: 'Web Development', 
      img: '/assets/images/project-6.png',
      link: 'https://github.com/DHYEY2703'
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
              {/*@ts-ignore*/}
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
          {filteredProjects.map((project, index) => (
            <li className="project-item active" key={index}>
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                <figure className="project-img">
                  <div className="project-item-icon-box">
                    {/*@ts-ignore*/}
                    <ion-icon name="eye-outline"></ion-icon>
                  </div>
                  <img src={project.img} alt={project.title} loading="lazy" />
                </figure>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-category">{project.category}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
};

export default Portfolio;
