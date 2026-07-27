// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Nav1 from './Nav1';
import Signup from './Signup';
import Login from './Login';
import Dashboard from './Dashboard';
import EditProduct from './EditProductForm.';
import DeleteProduct from './DeleteProduct';
import EmailVerified from './EmailVerified'; // Import the EmailVerified component

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if user is logged in from localStorage
        const user = localStorage.getItem('user');
        if (user) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    const handleSignup = () => {
        setIsLoggedIn(true);
    };

    return (
        <Router>
            <Nav1 />
            <Routes>
                {/* Authentication Routes */}
                <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                
                {/* Email Verification Route - Public (no login required) */}
                <Route path="/email-verified" element={<EmailVerified />} />
                
                {/* Protected Routes - Require Login */}
                <Route 
                    path="/dashboard" 
                    element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/edit-product/:id" 
                    element={isLoggedIn ? <EditProduct /> : <Navigate to="/login" />} 
                />
                <Route 
                    path="/delete-product1/:id" 
                    element={isLoggedIn ? <DeleteProduct /> : <Navigate to="/login" />} 
                />
                
                {/* Default Route */}
                <Route 
                    path="/" 
                    element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} 
                />
                
                {/* 404 Not Found - Optional but recommended */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;