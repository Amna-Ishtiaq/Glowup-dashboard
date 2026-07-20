import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const [checkouts, setCheckouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchCheckouts = async (showLoader = true) => {
        try {
            if (showLoader) setLoading(true);
            else setRefreshing(true);
            setError(null);

            const response = await axios.get('https://salon-backend-api-production.up.railway.app/checkouts');
            setCheckouts(response.data.checkouts || []);
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to load checkouts');
            console.error('Error fetching checkouts:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchCheckouts(true);
    }, []);

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return '—';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'completed': { label: 'Completed', class: 'status-completed' },
            'pending': { label: 'Pending', class: 'status-pending' },
            'failed': { label: 'Failed', class: 'status-failed' }
        };
        const normalizedStatus = (status || 'pending').toLowerCase();
        return statusMap[normalizedStatus] || statusMap.pending;
    };

    // Calculate stats
    const totalAmount = checkouts.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
    const completedCount = checkouts.filter(item =>
        (item.paymentStatus || '').toLowerCase() === 'completed'
    ).length;
    const infoChangedCount = checkouts.filter(item => item.customerInfoChanged).length;

    if (loading) {
        return (
            <div className="checkout-loading">
                <div className="loader"></div>
                <p>Loading checkouts...</p>
            </div>
        );
    }

    return (
        <div className="checkout-page-container">
            <div className="checkout-header">
                <h1>Checkouts</h1>
                <button
                    className="refresh-btn"
                    onClick={() => fetchCheckouts(false)}
                    disabled={refreshing}
                >
                    {refreshing ? 'Refreshing...' : '⟳ Refresh'}
                </button>
            </div>

            {/* Stats Cards */}
            <div className="checkout-stats">
                <div className="stat-card">
                    <div className="stat-label">Total Transactions</div>
                    <div className="stat-value">{checkouts.length}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Completed</div>
                    <div className="stat-value stat-completed">{completedCount}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Total Revenue</div>
                    <div className="stat-value stat-revenue">{formatCurrency(totalAmount)}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Customer Info Changed</div>
                    <div className="stat-value stat-changed">{infoChangedCount}</div>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    ⚠️ {error}
                </div>
            )}

            {/* Table */}
            <div className="table-responsive-wrapper">
                <table className="responsive-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Amount</th>
                            <th>Payment Intent</th>
                            <th>Status</th>
                            <th>Checkout Customer</th>
                            <th>Latest Customer</th>
                            <th>Info Changed</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {checkouts.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <div className="empty-state">
                                        <p>No checkouts found</p>
                                        <span style={{ color: '#a0aec0', fontSize: '0.9rem' }}>
                                            Payments will appear here once processed
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            checkouts.map((checkout, index) => {
                                const status = getStatusBadge(checkout.paymentStatus);
                                const checkoutCustomer = checkout.checkoutCustomer || {};
                                const latestCustomer = checkout.latestCustomerInfo;
                                const infoChanged = checkout.customerInfoChanged || false;

                                return (
                                    <tr key={checkout.id || index}>
                                        <td data-label="ID">
                                            <span className="id-cell" title={checkout.id}>
                                                {checkout.id ? checkout.id.slice(-8) : '—'}
                                            </span>
                                        </td>
                                        <td data-label="Amount">
                                            <span className="amount-cell">{formatCurrency(checkout.totalAmount)}</span>
                                        </td>
                                        <td data-label="Payment Intent">
                                            <span className="payment-id" title={checkout.paymentIntentId || 'No ID'}>
                                                {checkout.paymentIntentId ? checkout.paymentIntentId.slice(-12) : '—'}
                                            </span>
                                        </td>
                                        <td data-label="Status">
                                            <span className={`status-badge ${status.class}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td data-label="Checkout Customer">
                                            <div className="customer-info">
                                                <div className="customer-name">{checkoutCustomer.name || '—'}</div>
                                                <div className="customer-email">{checkoutCustomer.email || '—'}</div>
                                            </div>
                                        </td>
                                        <td data-label="Latest Customer">
                                            {latestCustomer ? (
                                                <div className="customer-info">
                                                    <div className="customer-name">{latestCustomer.name || '—'}</div>
                                                    <div className="customer-email">{latestCustomer.email || '—'}</div>
                                                </div>
                                            ) : (
                                                <span className="no-customer">No customer reference</span>
                                            )}
                                        </td>
                                        <td data-label="Info Changed">
                                            {infoChanged ? (
                                                <span className="changed-badge changed-yes">✓ Changed</span>
                                            ) : (
                                                <span className="changed-badge changed-no">— No change</span>
                                            )}
                                        </td>
                                        <td data-label="Created At">
                                            <span className="date-cell">{formatDate(checkout.createdAt)}</span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CheckoutPage;