// Login.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from './firebase/config';
import { useNavigate } from 'react-router-dom';
import './UserForm.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendUser, setResendUser] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if email is verified
      if (!user.emailVerified) {
        setResendUser(user); // Save user reference for resending email
        setError('⚠️ Please verify your email before logging in. Check your inbox.');
        setLoading(false);
        return;
      }

      // Login successful - store user data
      localStorage.setItem('user', JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.displayName || email.split('@')[0]
      }));
      
      navigate('/');

    } catch (err) {
      console.error('Login error:', err);
      
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No account found with this email.');
          break;
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Incorrect email or password.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Please try again later.');
          break;
        default:
          setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!resendUser) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await sendEmailVerification(resendUser, {
        url: 'https://glowup-dashboard-indol.vercel.app/email-verified',
      });
      setSuccess('📩 Verification email resent! Please check your inbox or spam folder.');
    } catch (err) {
      console.error('Resend email error:', err);
      if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Please wait a moment before trying again.');
      } else {
        setError('Failed to resend verification email. Please try logging in again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <p className="subtitle">Login to your account</p>

        {success && (
          <div className="alert alert-success" style={{ color: 'green', marginBottom: '10px' }}>
            {success}
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            {error}
            {error.includes('verify') && resendUser && (
              <div style={{ marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={handleResendVerification} 
                  disabled={loading}
                  className="btn-verify"
                  style={{
                    background: 'transparent',
                    border: '1px solid currentColor',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                >
                  {loading ? 'Sending...' : 'Resend Verification Email'}
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your email"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your password"
              className="form-input"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="signup-link">
          Don't have an account? <a href="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;