import React, { useState } from 'react';

const Portfolio: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [selectActive, setSelectActive] = useState(false);

  const projects = [
    { title: 'Finance', category: 'Web development', img: '/assets/images/project-1.jpg' },
    { title: 'Orizon', category: 'Web development', img: '/assets/images/project-2.png' },
    { title: 'Fundo', category: 'Web design', img: '/assets/images/project-3.jpg' },
    { title: 'Food Go', category: 'Applications', img: '/assets/images/project-4.png' },
    { title: 'DSM.', category: 'Web design', img: '/assets/images/project-5.png' },
    { title: 'MetaSpark', category: 'Web design', img: '/assets/images/project-6.png' },
    { title: 'Summary', category: 'Web development', img: '/assets/images/project-7.png' },
    { title: 'Krypto', category: 'Applications', img: '/assets/images/project-8.jpg' },
    { title: 'Arrival', category: 'Web development', img: '/assets/images/project-9.png' },
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
            <button className={filter === 'Web design' ? 'active' : ''} onClick={() => setFilter('Web design')}>Web design</button>
          </li>
          <li className="filter-item">
            <button className={filter === 'Applications' ? 'active' : ''} onClick={() => setFilter('Applications')}>Applications</button>
          </li>
          <li className="filter-item">
            <button className={filter === 'Web development' ? 'active' : ''} onClick={() => setFilter('Web development')}>Web development</button>
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
              <button onClick={() => { setFilter('Web design'); setSelectActive(false); }}>Web design</button>
            </li>
            <li className="select-item">
              <button onClick={() => { setFilter('Applications'); setSelectActive(false); }}>Applications</button>
            </li>
            <li className="select-item">
              <button onClick={() => { setFilter('Web development'); setSelectActive(false); }}>Web development</button>
            </li>
          </ul>
        </div>

        <ul className="project-list">
          {filteredProjects.map((project, index) => (
            <li className="project-item active" key={index}>
              <a href="#">
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
