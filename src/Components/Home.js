import '../Styles/Home.css';
import { motion } from 'framer-motion';
import '../App.css';

const Home = () => {
  return (
    <>
      <div className="hero-banner">
        <div className="hero-information-div">
          <motion.h1 
          className='medilog'
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
          >
            WELCOME TO MEDILOG
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.3, duration: 0.5 }}>
            A seamless and efficient platform for managing medical data, ensuring accuracy, security, and easy access.
          </motion.p>

          <div className="features-container">
            <motion.div 
              className="feature-box blue-box"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h2>Why Choose MEDILOG?</h2>
              <p>MediLog simplifies medical data management, enhances patient record-keeping, and ensures real-time access to critical information.</p>
              <button className="learn-more-btn">Learn More</button>
            </motion.div>

            <motion.div 
              className="feature-box"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <span className="icon">📊</span>
              <h3>Data-Driven Insights</h3>
              <p>Analyze trends and generate reports to improve decision-making in medical operations and patient care.</p>
            </motion.div>

            <motion.div 
              className="feature-box"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <span className="icon">🔒</span>
              <h3>Secure & Compliant</h3>
              <p>Ensuring data privacy and compliance with healthcare regulations through advanced encryption.</p>
            </motion.div>

            <motion.div 
              className="feature-box"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <span className="icon">⏳</span>
              <h3>Efficient Record Management</h3>
              <p>Quick access to medical records, prescriptions, and reports, reducing paperwork and saving time.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
