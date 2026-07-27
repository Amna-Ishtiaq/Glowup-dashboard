// Signup.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from './firebase/config';
import { useNavigate } from 'react-router-dom';
import './UserForm.css';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      // 1. Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Send verification email
      const actionCodeSettings = {
        url: 'https://glowup-dashboard-indol.vercel.app/email-verified', // Your redirect URL after verification
        handleCodeInApp: true // Important for email link sign-in flow
      };

      await sendEmailVerification(user, actionCodeSettings);

      // 3. Show success message
      setVerificationSent(true);
      setMessage(`✅ Verification email sent to ${email}. Please check your inbox.`);

      // Optionally store user data in your own database
      // await fetch('https://salon-backend-api-production.up.railway.app/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, uid: user.uid })
      // });

      // Clear form
      setName('');
      setPassword('');

    } catch (err) {
      console.error('Signup error:', err);
      
      // Handle Firebase errors
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered. Please login.');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Use at least 6 characters.');
          break;
        default:
          setError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email
  const handleResendVerification = async () => {
    if (!auth.currentUser) {
      setError('Please sign up again.');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await sendEmailVerification(auth.currentUser);
      setMessage('📧 Verification email resent! Check your inbox.');
    } catch (err) {
      setError('Failed to resend. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create Account</h2>
        <p className="subtitle">Sign up with Firebase</p>

        {message && (
          <div className="alert alert-success">{message}</div>
        )}
        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        {!verificationSent ? (
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter your name"
                className="form-input"
              />
            </div>

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
                placeholder="Min 6 characters"
                className="form-input"
                minLength="6"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        ) : (
          <div className="verification-section">
            <div className="verification-icon">📧</div>
            <h3>Verify Your Email</h3>
            <p>We sent a verification link to <strong>{email}</strong></p>
            <p className="verification-hint">
              Check your inbox (and spam folder) and click the verification link.
            </p>
            
            <button
              onClick={handleResendVerification}
              disabled={loading}
              className="btn-secondary"
            >
              {loading ? 'Sending...' : 'Resend Verification Email'}
            </button>
            
            <button
              onClick={() => setVerificationSent(false)}
              className="btn-link"
            >
              Use a different email
            </button>
          </div>
        )}

        <div className="login-link">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;