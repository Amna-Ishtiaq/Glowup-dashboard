// EmailVerified.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const EmailVerified = () => {
  const [message, setMessage] = useState('Verifying your email...');
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setMessage('✅ Email verified successfully! Redirecting to login...');
        // Store in localStorage or your backend
        localStorage.setItem('user', JSON.stringify({
          uid: user.uid,
          email: user.email
        }));
        setTimeout(() => navigate('/login'), 3000);
      } else if (user && !user.emailVerified) {
        setMessage('⚠️ Email not yet verified. Please check your inbox and click the verification link.');
      } else {
        setMessage('Please sign up or login.');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="verification-page">
      <h2>{message}</h2>
    </div>
  );
};

export default EmailVerified;