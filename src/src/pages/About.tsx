import React, { useState } from 'react';

const About: React.FC = () => {
  const [modalData, setModalData] = useState<{name: string, text: string, date: string, avatar: string} | null>(null);

  const testimonials = [
    {
      name: 'Rishav Desai',
      avatar: '/assets/images/avatar-1.png',
      date: '14 June, 2021',
      text: `"Dhyey did an outstanding job creating our corporate identity. She listened carefully to our ideas and transformed them into a design that truly reflects our brand. Her creativity and attention to detail were exceptional, and the final result exceeded our expectations. We couldn't be happier with her work and would recommend her without hesitatio"`
    },
    {
      name: 'Kashish Dhulia',
      avatar: '/assets/images/avatar-2.png',
      date: '14 June, 2021',
      text: `"Working with Dhyey was an absolute pleasure. She took the time to understand our vision and provided a corporate identity that perfectly aligns with our brand values. Dhyey was always responsive, professional, and easy to work with, ensuring the project ran smoothly. We're thrilled with the final design and highly recommend her services."`
    },
    {
      name: 'Poonam Makhija',
      avatar: '/assets/images/avatar-3.png',
      date: '14 June, 2021',
      text: `"We are incredibly impressed with the corporate identity that Dhyey created for us. Her process was seamless, and she really understood the essence of our brand. Dhyey’s design captured our vision beautifully and helped elevate our image in the market. We’re extremely satisfied with her work and look forward to working with her again."`
    },
    {
      name: 'Devanshu Jain',
      avatar: '/assets/images/avatar-4.png',
      date: '14 June, 2021',
      text: `"Dhyey exceeded our expectations in every way. She took the time to understand our goals and provided us with a corporate identity that is both creative and professional. Her attention to detail and commitment to delivering the best design was evident throughout the process. We are delighted with the final result and highly recommend her to anyone looking for top-tier design work."`
    }
  ];

  return (
    <article className="about active" data-page="about">
      <header>
        <h2 className="h2 article-title">About me</h2>
      </header>

      <section className="about-text">
        <p>
          I'm Creative Director and UI/UX Designer from Sydney, Australia, working in web development and print media. I enjoy turning complex problems into simple, beautiful and intuitive designs.
        </p>
        <p>
          My job is to build your website so that it is functional and user-friendly but at the same time attractive. Moreover, I add personal touch to your product and make sure that is eye-catching and easy to use. My aim is to bring across your message and identity in the most creative way. I created web design for many famous brand companies.
        </p>
      </section>

      <section className="service">
        <h3 className="h3 service-title">What i'm doing</h3>
        <ul className="service-list">
          <li className="service-item">
            <div className="service-icon-box">
              <img src="/assets/images/icon-design.svg" alt="design icon" width="40" />
            </div>
            <div className="service-content-box">
              <h4 className="h4 service-item-title">Web design</h4>
              <p className="service-item-text">
                The most modern and high-quality design made at a professional level.
              </p>
            </div>
          </li>
          <li className="service-item">
            <div className="service-icon-box">
              <img src="/assets/images/icon-dev.svg" alt="Web development icon" width="40" />
            </div>
            <div className="service-content-box">
              <h4 className="h4 service-item-title">Web development</h4>
              <p className="service-item-text">
                High-quality development of sites at the professional level.
              </p>
            </div>
          </li>
          <li className="service-item">
            <div className="service-icon-box">
              <img src="/assets/images/icon-app.svg" alt="mobile app icon" width="40" />
            </div>
            <div className="service-content-box">
              <h4 className="h4 service-item-title">Mobile apps</h4>
              <p className="service-item-text">
                Professional development of applications for iOS and Android.
              </p>
            </div>
          </li>
          <li className="service-item">
            <div className="service-icon-box">
              <img src="/assets/images/icon-photo.svg" alt="camera icon" width="40" />
            </div>
            <div className="service-content-box">
              <h4 className="h4 service-item-title">Photography</h4>
              <p className="service-item-text">
                I make high-quality photos of any category at a professional level.
              </p>
            </div>
          </li>
        </ul>
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
        <h3 className="h3 clients-title">Clients</h3>
        <ul className="clients-list has-scrollbar">
          <li className="clients-item"><a href="#"><img src="/assets/images/logo-1-color.png" alt="client logo" /></a></li>
          <li className="clients-item"><a href="#"><img src="/assets/images/logo-2-color.png" alt="client logo" /></a></li>
          <li className="clients-item"><a href="#"><img src="/assets/images/logo-3-color.png" alt="client logo" /></a></li>
          <li className="clients-item"><a href="#"><img src="/assets/images/logo-4-color.png" alt="client logo" /></a></li>
          <li className="clients-item"><a href="#"><img src="/assets/images/logo-5-color.png" alt="client logo" /></a></li>
          <li className="clients-item"><a href="#"><img src="/assets/images/logo-6-color.png" alt="client logo" /></a></li>
        </ul>
      </section>
    </article>
  );
};

export default About;
