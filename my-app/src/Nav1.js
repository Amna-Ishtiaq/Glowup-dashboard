// Nav1.js
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Nav1.css';

const Nav1 = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();

    // Check login state
    useEffect(() => {
        const user = localStorage.getItem('user');
        setIsLoggedIn(!!user);
    }, [location]); // Recheck when route changes

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-brand" onClick={closeMenu}>
                    <span className="brand-dot"></span>Salon
                </Link>
                
                <button 
                    className={`navbar-toggle ${isOpen ? 'active' : ''}`} 
                    onClick={toggleMenu}
                    aria-label="Toggle navigation"
                >
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                    <span className="hamburger-line"></span>
                </button>

                <div className={`navbar-menu ${isOpen ? 'is-open' : ''}`}>
                    <div className="navbar-links">
                        {isLoggedIn ? (
                            <>
                                <Link to="/dashboard" className="navbar-link" onClick={closeMenu}>Dashboard</Link>
                                <button 
                                    className="navbar-link navbar-btn" 
                                    onClick={() => {
                                        localStorage.removeItem('user');
                                        closeMenu();
                                        window.location.href = '/login';
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="navbar-link" onClick={closeMenu}>Login</Link>
                                <Link to="/signup" className="navbar-link signup-highlight" onClick={closeMenu}>Signup</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Nav1;
