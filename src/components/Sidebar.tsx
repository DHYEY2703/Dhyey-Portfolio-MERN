import React, { useState } from 'react';

interface SidebarProps {
  toggleTheme: () => void;
  theme: string;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleTheme, theme }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <aside className={`sidebar ${isActive ? 'active' : ''}`} data-sidebar>
      <div className="sidebar-info">
        <figure className="avatar-box">
          <img src="/assets/images/my-avatar.png" alt="Dhyey Barbhaya" width="80" />
        </figure>

        <div className="info-content" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1 className="name" title="Dhyey Barbhaya">Dhyey Barbhaya</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <p className="title">Full Stack Developer</p>
            <button 
              onClick={toggleTheme} 
              style={{ 
                background: 'var(--border-gradient-onyx)', 
                color: 'var(--orange-yellow-crayola)', 
                border: 'none', 
                borderRadius: '8px', 
                width: '35px', 
                height: '35px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer',
                boxShadow: 'var(--shadow-1)'
              }}
              title="Toggle Theme"
            >
              {/*@ts-ignore*/}
              <ion-icon name={theme === 'dark' ? 'sunny-outline' : 'moon-outline'}></ion-icon>
            </button>
          </div>
        </div>

        <button 
          className="info_more-btn" 
          onClick={() => setIsActive(!isActive)}
          data-sidebar-btn
        >
          <span>Show Contacts</span>
          {/*@ts-ignore*/}
          <ion-icon name="chevron-down"></ion-icon>
        </button>
      </div>

      <div className="sidebar-info_more">
        <div className="separator"></div>

        <ul className="contacts-list">
          <li className="contact-item">
            <div className="icon-box">
              {/*@ts-ignore*/}
              <ion-icon name="mail-outline"></ion-icon>
            </div>
            <div className="contact-info">
              <p className="contact-title">Email</p>
              <a href="mailto:dhyeybarbhaya@gmail.com" className="contact-link">dhyeybarbhaya@gmail.com</a>
            </div>
          </li>

          <li className="contact-item">
            <div className="icon-box">
              {/*@ts-ignore*/}
              <ion-icon name="phone-portrait-outline"></ion-icon>
            </div>
            <div className="contact-info">
              <p className="contact-title">Phone</p>
              <a href="tel:+918347938469" className="contact-link">+91 8347938469</a>
            </div>
          </li>

          <li className="contact-item">
            <div className="icon-box">
              {/*@ts-ignore*/}
              <ion-icon name="calendar-outline"></ion-icon>
            </div>
            <div className="contact-info">
              <p className="contact-title">Birthday</p>
              <time dateTime="2004-07-02">July 02, 2004</time>
            </div>
          </li>

          <li className="contact-item">
            <div className="icon-box">
              {/*@ts-ignore*/}
              <ion-icon name="location-outline"></ion-icon>
            </div>
            <div className="contact-info">
              <p className="contact-title">Location</p>
              <address>Vadodara, Gujarat, India</address>
            </div>
          </li>
        </ul>

        <div className="separator"></div>

        <ul className="social-list">
          <li className="social-item">
            <a href="https://www.facebook.com/share/18ZeJhgwJa/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="social-link">
              {/*@ts-ignore*/}
              <ion-icon name="logo-facebook"></ion-icon>
            </a>
          </li>
          <li className="social-item">
            <a href="https://x.com/BarbhayaY64952" target="_blank" rel="noopener noreferrer" className="social-link">
              {/*@ts-ignore*/}
              <ion-icon name="logo-twitter"></ion-icon>
            </a>
          </li>
          <li className="social-item">
            <a href="https://www.instagram.com/oyyy.dhyeylaa/" target="_blank" rel="noopener noreferrer" className="social-link">
              {/*@ts-ignore*/}
              <ion-icon name="logo-instagram"></ion-icon>
            </a>
          </li>
          <li className="social-item">
            <a href="https://github.com/DHYEY2703" target="_blank" rel="noopener noreferrer" className="social-link">
              {/*@ts-ignore*/}
              <ion-icon name="logo-github"></ion-icon>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
