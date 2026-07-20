import React, { useState, useEffect } from 'react';
import './UserForm.css';
import { useNavigate, Link } from 'react-router-dom';

const Loginbody = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const auth = localStorage.getItem("user");
        if (auth) {
            navigate("/");
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = { email, password };

        let result = await fetch("http://localhost:4500/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        result = await result.json();
        console.warn("Data submitted", result);

        // Clear form fields
        setEmail('');
        setPassword('');

        // Store the result in local storage
        localStorage.setItem("user", JSON.stringify(result));

        // Navigate to the homepage after successful signup
        navigate("/");
    };

    return (
        <div className="user-form-container">
            <div className="user-form">
                <h3>Login</h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit">Sign In</button>
                </form>
                <p className="auth-redirect-text">
                    Don't have an account? <Link to="/signup">Sign up here</Link>
                </p>
            </div>
        </div>
    );
};

export default Loginbody;
