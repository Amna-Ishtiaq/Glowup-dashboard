import React, { useState } from 'react';
import './Dashboard.css';
import Overview from './Overview';
import AddProduct from './AddProduct';
import ManageProducts from './ManageProducts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [view, setView] = useState('overview');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user"); // Remove user data from localStorage
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <h2>Admin Dashboard</h2>
                <ul>
                    <li onClick={() => setView('overview')}>Overview</li>
                    <li onClick={() => setView('addProduct')}>Add Product</li>
                    <li onClick={() => setView('manageProducts')}>Manage Products</li>
                    <li onClick={handleLogout}>Logout</li>
                </ul>
            </aside>

            <main className="main-content">
                {view === 'overview' && <Overview />}
                {view === 'addProduct' && <AddProduct />}
                {view === 'manageProducts' && <ManageProducts />}
            </main>
        </div>
    );
};

export default Dashboard;
