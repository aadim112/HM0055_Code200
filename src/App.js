import { useState } from 'react';
import logo from '../src/Assets/logo-main.png';
import './App.css';
import { HashRouter, Route, Link, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Account from './Components/Account';
import Admin from './Components/Admin';
import DoctorHome from './Components/DoctorHome';
import AppointmentPage from './Components/AppointmentPage';
import Administrator from './Components/Administrator';
import PatientHome from './Components/PatientHome';
import HospitalHome from './Components/HospitalHome';
import Institution from './Components/Institution';
import Contact from './Components/Contact';
import Footer from './Components/Footer';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Close menu when a link is clicked
  const closeMenu = () => {
    if (menuOpen) setMenuOpen(false);
  };

  return (
    <>
      <header>
        <div className='logo-div'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1>MEDILOG</h1>
        </div>
        
        <button className='mobile-menu-btn' onClick={toggleMenu}>
          <i className={menuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
        </button>
        
        <div className={`nav-div ${menuOpen ? 'open' : ''}`}>
          <Link to='/' onClick={closeMenu}>
            <i className="fa-solid fa-house"></i>Home
          </Link>
          <Link to='/Account' onClick={closeMenu}>
            <i className="fa-solid fa-user"></i>Account
          </Link>
          <Link to='/bookappointment' onClick={closeMenu}>
            <i className="fa-solid fa-calendar-check"></i>Book Appointment
          </Link>
          <Link to='/Contact' onClick={closeMenu}>
            <i className="fa-solid fa-phone"></i>Contact
          </Link>
          <Link to='/InstituteAction' onClick={closeMenu}>
            <i className="fa-solid fa-hospital"></i>Hospital
          </Link>
        </div>
      </header>
      
      <Routes>
        <Route path='/account' element={<Account />} />
        <Route path='/' element={<Home />}></Route>
        <Route path='/DoctorPanel' element={<DoctorHome />}></Route>
        <Route path='/Admin' element={<Admin />}></Route>
        <Route path='/PatientPanel' element={<PatientHome />}></Route>
        <Route path='/bookappointment' element={<AppointmentPage />}></Route>
        <Route path='/Administator' element={<Administrator />}></Route>
        <Route path='/Contact' element={<Contact />}></Route>
        <Route path='/InstituteAction' element={<HospitalHome />}></Route>
        <Route path='/Institute' element={<Institution />}></Route>
      </Routes>
      
      <Footer />
    </>
  );
}

export default App;