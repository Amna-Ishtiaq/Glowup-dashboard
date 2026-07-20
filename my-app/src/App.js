import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Nav1 from './Nav1';
import Signup from './Signup';
import Login from './Login';
import Dashboard from './Dashboard';
// import ManageProduct from './ManageProducts';

import EditProduct from './EditProductForm.';
import DeleteProduct from './DeleteProduct';

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
            {/* <ManageProduct /> */}
            <Routes>
                <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
                <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
                <Route path='/edit-product/:id' element={<EditProduct />} />
        {/* Route for delete confirmation page */}
        <Route path="/delete-product1/:id" element={<DeleteProduct />} />
            </Routes>
        </Router>
    );
};

export default App;
