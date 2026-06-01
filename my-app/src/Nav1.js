// Nav1.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Nav1.css'; // Import your custom CSS file

const Nav1 = () => {
    return (
        <nav className="navbar">
            <div className="navbar-brand">Salon</div>
            <div className="navbar-links">
                <Link to="/signup" className="navbar-link">Signup</Link>
                <Link to="/login" className="navbar-link">Login</Link>
            </div>
        </nav>
    );
};

export default Nav1;
