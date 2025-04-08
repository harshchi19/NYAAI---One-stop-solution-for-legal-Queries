import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import './component.css';
import { useNavigate } from 'react-router-dom';

const Navgate = () => {

    const navigate = useNavigate();

    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Hide navbar on downward scroll
            if (currentScrollY > lastScrollY + 5) {
                setIsNavbarVisible(false);
            }
            // Show navbar on upward scroll
            else if (currentScrollY < lastScrollY - 5) {
                setIsNavbarVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    const handleNavigateToLogin = () => {
        navigate('/login'); 
      };

    return (
        <nav className={`land-navbar ${isNavbarVisible ? 'visible' : 'hidden'}`}>
            <div className="logo-container">
                <img 
                    src={logo}
                    alt="Company Logo" 
                    className="logo"
                />
                <span className="company-name">NyaAI</span>
            </div>
            <div className='land-nav-link'>
                <a className='land-nav-links'>Home</a>
                <a className='land-nav-links'>About</a>
                <a className='land-nav-links'>Services</a>
                <a className='land-nav-links'>Contact</a>
            </div>
            <div className='land-nav-button'>
                <button className="land-navbar-button" onClick={handleNavigateToLogin}>
                    Login
                    <svg className="icon" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </button>
            </div>
        </nav>
    );
};

export default Navgate;
