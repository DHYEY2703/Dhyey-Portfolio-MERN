import React, { useState } from 'react';

const Sidebar: React.FC = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <aside className={`sidebar ${isActive ? 'active' : ''}`} data-sidebar>
      <div className="sidebar-info">
        <figure className="avatar-box">
          <img src="/assets/images/my-avatar.png" alt="Dhyey Barbhaya" width="80" />
        </figure>

        <div className="info-content">
          <h1 className="name" title="Dhyey Barbhaya">Dhyey Barbhaya</h1>
          <p className="title">Full Stack Developer</p>
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
            <a href="#" className="social-link">
              {/*@ts-ignore*/}
              <ion-icon name="logo-facebook"></ion-icon>
            </a>
          </li>
          <li className="social-item">
            <a href="#" className="social-link">
              {/*@ts-ignore*/}
              <ion-icon name="logo-twitter"></ion-icon>
            </a>
          </li>
          <li className="social-item">
            <a href="#" className="social-link">
              {/*@ts-ignore*/}
              <ion-icon name="logo-instagram"></ion-icon>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
