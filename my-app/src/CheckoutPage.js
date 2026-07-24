import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const [checkouts, setCheckouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [searchEmail, setSearchEmail] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const fetchCheckouts = async (showLoader = true) => {
        try {
            if (showLoader) setLoading(true);
            else setRefreshing(true);
            setError(null);

            const response = await axios.get('https://salon-backend-api-production.up.railway.app/checkouts');
            setCheckouts(response.data.checkouts || []);
            setSearchEmail(''); // Clear search when fetching all
            setIsSearching(false);
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to load checkouts');
            console.error('Error fetching checkouts:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const searchByEmail = async (e) => {
        e.preventDefault();
        
        if (!searchEmail.trim()) {
            // If search is empty, fetch all checkouts
            fetchCheckouts(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setIsSearching(true);

            const response = await axios.get(`https://salon-backend-api-production.up.railway.app/checkouts/email/${encodeURIComponent(searchEmail.trim())}`);
            setCheckouts(response.data.checkouts || []);
            
            if (response.data.checkouts.length === 0) {
                setError(`No checkouts found for email: ${searchEmail}`);
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message || 'Failed to search checkouts');
            console.error('Error searching checkouts:', err);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchEmail('');
        setIsSearching(false);
        fetchCheckouts(false);
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
            'failed': { label: 'Failed', class: 'status-failed' },
            'succeeded': { label: 'Succeeded', class: 'status-completed' },
            'requires_payment_method': { label: 'Requires Payment', class: 'status-pending' },
            'requires_confirmation': { label: 'Requires Confirmation', class: 'status-pending' },
            'requires_action': { label: 'Requires Action', class: 'status-pending' },
            'processing': { label: 'Processing', class: 'status-pending' },
            'canceled': { label: 'Canceled', class: 'status-failed' }
        };
        const normalizedStatus = (status || 'pending').toLowerCase();
        return statusMap[normalizedStatus] || statusMap.pending;
    };

    // Calculate stats
    const totalAmount = checkouts.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
    const completedCount = checkouts.filter(item =>
        (item.paymentStatus || '').toLowerCase() === 'completed' || 
        (item.paymentStatus || '').toLowerCase() === 'succeeded'
    ).length;

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
                <h1>Checkouts {isSearching && <span className="search-badge">🔍 Search Results</span>}</h1>
                <div className="header-actions">
                    <form onSubmit={searchByEmail} className="search-form">
                        <input
                            type="email"
                            placeholder="Search by email..."
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-btn">
                            🔍 Search
                        </button>
                        {isSearching && (
                            <button type="button" onClick={clearSearch} className="clear-btn">
                                ✕ Clear
                            </button>
                        )}
                    </form>
                    <button
                        className="refresh-btn"
                        onClick={() => fetchCheckouts(false)}
                        disabled={refreshing}
                    >
                        {refreshing ? 'Refreshing...' : '⟳ Refresh'}
                    </button>
                </div>
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
            </div>

            {error && (
                <div className={`error-message ${error.includes('No checkouts found') ? 'info-message' : ''}`}>
                    {error.includes('No checkouts found') ? 'ℹ️' : '⚠️'} {error}
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
                            <th>Client Secret</th>
                            <th>Status</th>
                            <th>Customer</th>
                            <th>Cart Items</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {checkouts.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '40px 0' }}>
                                    <div className="empty-state">
                                        <p>{isSearching ? 'No checkouts found for this email' : 'No checkouts found'}</p>
                                        <span style={{ color: '#a0aec0', fontSize: '0.9rem' }}>
                                            {isSearching ? 'Try a different email address' : 'Payments will appear here once processed'}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            checkouts.map((checkout, index) => {
                                const status = getStatusBadge(checkout.paymentStatus);
                                const cart = Array.isArray(checkout.cart) ? checkout.cart : [];

                                return (
                                    <tr key={checkout._id || checkout.id || index}>
                                        <td data-label="ID">
                                            <span className="id-cell" title={checkout._id || checkout.id}>
                                                {checkout._id ? checkout._id.slice(-8) : 
                                                 checkout.id ? checkout.id.slice(-8) : '—'}
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
                                        <td data-label="Client Secret">
                                            <span className="client-secret" title={checkout.clientSecret || 'No secret'}>
                                                {checkout.clientSecret ? checkout.clientSecret.slice(-8) : '—'}
                                            </span>
                                        </td>
                                        <td data-label="Status">
                                            <span className={`status-badge ${status.class}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td data-label="Customer">
                                            <div className="customer-info">
                                                <div className="customer-name">{checkout.customerName || '—'}</div>
                                                <div className="customer-email">{checkout.customerEmail || '—'}</div>
                                            </div>
                                        </td>
                                        <td data-label="Cart Items">
                                            {cart.length > 0 ? (
                                                <div className="cart-cell">
                                                    {cart.map((item, i) => {
                                                        // Handle productId being null or an object
                                                        let productName = null;
                                                        let productPrice = null;
                                                        
                                                        if (item.productId && typeof item.productId === 'object') {
                                                            // productId is an object with name and price
                                                            productName = item.productId.name || `Product ${i + 1}`;
                                                            productPrice = item.productId.price;
                                                        } else if (item.productId === null) {
                                                            productName = 'Product not available';
                                                        } else if (typeof item.productId === 'string') {
                                                            productName = `Product ID: ${item.productId.slice(-6)}`;
                                                        }
                                                        
                                                        const quantity = item.quantity || 1;
                                                        
                                                        return (
                                                            <div key={item._id || i} className="cart-item">
                                                                {productName}
                                                                {quantity > 1 ? ` x${quantity}` : ''}
                                                                {productPrice ? ` — $${parseFloat(productPrice).toFixed(2)}` : ''}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ) : (
                                                <span className="no-cart">—</span>
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