import React, { useState } from 'react';
import type { FormEvent } from 'react';
import toast from 'react-hot-toast';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ fullname: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = formData.fullname.trim() && formData.email.trim() && formData.message.trim();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Message sent successfully!');
        setFormData({ fullname: '', email: '', message: '' });
      } else {
        toast.error(data.error || 'Failed to send message.');
      }
    } catch {
      toast.error('Server is not reachable. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <article className="contact active" data-page="contact">
      <header>
        <h2 className="h2 article-title">Contact</h2>
      </header>

      <section className="mapbox" data-mapbox>
        <figure>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14654.802744906364!2d73.16973006764756!3d22.30715825380192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395fc8a8c9ae507b%3A0x7c3e77fefb7b4df1!2sVadodara%2C%20Gujarat%2C%20India!5e0!3m2!1sen!2sin!4v1703420422331!5m2!1sen!2sin"
            width="400" 
            height="300" 
            loading="lazy"
            title="Map of Vadodara, Gujarat, India"
            style={{ border: 0 }}
          ></iframe>
        </figure>
      </section>

      <section className="contact-form">
        <h3 className="h3 form-title">Contact Form</h3>

        <form className="form" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input 
              type="text" 
              name="fullname" 
              className="form-input" 
              placeholder="Full name" 
              required 
              value={formData.fullname}
              onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
            />
            <input 
              type="email" 
              name="email" 
              className="form-input" 
              placeholder="Email address" 
              required 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <textarea 
            name="message" 
            className="form-input" 
            placeholder="Your Message" 
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          ></textarea>
          <button 
            className="form-btn" 
            type="submit" 
            disabled={!isFormValid || isSubmitting}
            style={{ opacity: isFormValid && !isSubmitting ? 1 : 0.5 }}
          >
            {/*@ts-ignore*/}
            <ion-icon name={isSubmitting ? 'hourglass-outline' : 'paper-plane'}></ion-icon>
            <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
          </button>
        </form>
      </section>
    </article>
  );
};

export default Contact;
