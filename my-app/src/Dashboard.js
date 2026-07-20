import React, { useState } from 'react';
import './Dashboard.css';
import Overview from './Overview';
import AddProduct from './AddProduct';
import ManageProducts from './ManageProducts';
import CheckoutPage from './CheckoutPage'; // Import the new CheckoutPage
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [view, setView] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user"); // Remove user data from localStorage
        navigate('/login'); // Redirect to login page
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleViewChange = (newView) => {
        setView(newView);
        setSidebarOpen(false); // Close sidebar on mobile after selecting item
    };

    return (
        <div className="dashboard-container">
            {/* Mobile Header Menu Bar */}
            <div className="mobile-dashboard-header">
                <button className="mobile-sidebar-toggle" onClick={toggleSidebar}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div className="mobile-dashboard-title">Admin Dashboard</div>
            </div>

            {/* Sidebar backdrop overlay for mobile */}
            {sidebarOpen && <div className="sidebar-backdrop" onClick={toggleSidebar}></div>}

            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>Admin Panel</h2>
                    <button className="sidebar-close-btn" onClick={toggleSidebar}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                <ul className="sidebar-nav">
                    <li
                        className={view === 'overview' ? 'active' : ''}
                        onClick={() => handleViewChange('overview')}
                    >
                        <span className="sidebar-icon">📊</span> Overview
                    </li>
                    <li
                        className={view === 'addProduct' ? 'active' : ''}
                        onClick={() => handleViewChange('addProduct')}
                    >
                        <span className="sidebar-icon">➕</span> Add Product
                    </li>
                    <li
                        className={view === 'manageProducts' ? 'active' : ''}
                        onClick={() => handleViewChange('manageProducts')}
                    >
                        <span className="sidebar-icon">⚙️</span> Manage Products
                    </li>
                    <li
                        className={view === 'checkouts' ? 'active' : ''}
                        onClick={() => handleViewChange('checkouts')}
                    >
                        <span className="sidebar-icon">💰</span> Checkouts
                    </li>
                    <li className="logout-item" onClick={handleLogout}>
                        <span className="sidebar-icon">🚪</span> Logout
                    </li>
                </ul>
            </aside>

            <main className="main-content">
                {view === 'overview' && <Overview />}
                {view === 'addProduct' && <AddProduct />}
                {view === 'manageProducts' && <ManageProducts />}
                {view === 'checkouts' && <CheckoutPage />}
            </main>
        </div>
    );
};

export default Dashboard;