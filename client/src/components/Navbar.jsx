// Navbar.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './components.css';
import logo from '../assets/logo.png';
import { getAuth, signOut } from "firebase/auth";

const Navbar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navigate = useNavigate();

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth); 
    localStorage.removeItem("user");
    localStorage.removeItem("userToken"); 
    navigate("/");
  };
  
  const navLinks = [
    { path: '/homepage', name: 'Home' },
    { path: '/chatbot', name: 'Chatbot' },
    { path: '/matchmaking', name: 'Legal Match' },
    { path: '/docgenerator', name: 'Legal Doc Generator' },
    { path: '/caseanalysis', name: 'Verdict Vista' },
    { path: '/flow', name: 'Legal Flow' },
    { path: '/news', name: 'Legal News' },
   // { path: '/ai-courtroom', name: 'AI Courtroom' },
    { name: 'Logout', onClick: true }
  ];

  return (
    <nav className={`navbar ${isHome ? 'home' : 'other-page'}`}>
      <div className="logo-container">
        <img 
          src={logo}
          alt="Company Logo" 
          className="logo"
        />
        <span className="company-name">Nyaai</span>
      </div>

      <div className="nav-links">
      {navLinks.map((link) => (
          <div key={link.name} className={`div-link ${location.pathname === link.path ? 'active' : ''}`}>
            {link.onClick ? (
              <span className="nav-link logout-btn" onClick={handleLogout}>
                {link.name}
              </span>
            ) : link.isExternal ? (
              <a href={link.path} target="_blank" rel="noopener noreferrer" className="nav-link">
                {link.name}
              </a>
            ) : (
              <Link to={link.path} className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}>
                {link.name}
              </Link>
            )}
          </div>
        ))}

      </div>
    </nav>
  );
};

export default Navbar;