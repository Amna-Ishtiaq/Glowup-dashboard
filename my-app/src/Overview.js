import React from 'react';
import './Overview.css'; // Import the CSS file for styling

const Overview = () => (
    <div className="overview-container">
        <h1>Welcome to Your Dashboard</h1>
        <div className="stats-container">
            <div className="stat-card">
                <h2>Total Appointments</h2>
                <p>150</p>
                <p className="stat-description">
                    This is the total number of appointments scheduled this month. Keep track of your salon's growth and client engagement.
                </p>
            </div>
            <div className="stat-card">
                <h2>Total Products</h2>
                <p>50</p>
                <p className="stat-description">
                    You currently have 50 products in your inventory. Ensure that your stock is updated regularly to meet client demands.
                </p>
            </div>
            <div className="stat-card">
                <h2>Clients Served</h2>
                <p>200</p>
                <p className="stat-description">
                    A total of 200 clients have been served this quarter. Building strong relationships with your clients is key to retention.
                </p>
            </div>
            <div className="stat-card">
                <h2>Total Revenue</h2>
                <p>$5,000</p>
                <p className="stat-description">
                    Your salon has generated $5,000 in revenue this month. Monitor your earnings to strategize for future growth.
                </p>
            </div>
        </div>
    </div>
);

export default Overview;
