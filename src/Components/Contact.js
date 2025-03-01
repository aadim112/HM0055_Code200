import '../App.css';
import '../Styles/Contact.css';
import { motion } from 'framer-motion';
import { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.description) {
      setMessage('Please fill out all fields.');
      return;
    }
    setMessage('Your message has been sent successfully!');
    setFormData({ name: '', email: '', description: '' });
  };

  return (
    <>
      <div className="contact-banner">
        <div className="contact-information-div">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="contact-heading"
          >
            CONTACT US
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="contact-description"
          >
            Have questions or need assistance? Fill out the form below, and we will get back to you as soon as possible.
          </motion.p>

          <motion.form
            className="contact-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Describe your issue or question"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
            <button type="submit" className="contact-btn">Submit</button>
            {message && <p className="success-message">{message}</p>}
          </motion.form>

          <div className="contact-details-container">
            <motion.div
              className="contact-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <span className="icon">📞</span>
              <h3>Phone Support</h3>
              <p>Call us at +1 234 567 890 for immediate support.</p>
            </motion.div>

            <motion.div
              className="contact-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <span className="icon">📧</span>
              <h3>Email Support</h3>
              <p>Email us at support@medilog.com for inquiries.</p>
            </motion.div>

            <motion.div
              className="contact-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <span className="icon">📍</span>
              <h3>Visit Us</h3>
              <p>1234 Health St, Medical City, USA</p>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;