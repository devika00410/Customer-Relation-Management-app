import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../Services/api';
import './Auth.css'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
  
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user'
    });

    setTimeout(() => {
      if (usernameRef.current) usernameRef.current.value = "";
      if (emailRef.current) emailRef.current.value = "";
      if (passwordRef.current) passwordRef.current.value = "";
    }, 100);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  
      
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    console.log('Registration attempt started...');
    
    const response = await api.post('/auth/register', formData);
    console.log('Registration successful:', response.data);

    console.log('Testing backend connection...');
    try {
      const testResponse = await api.get('/test');
      console.log('Backend test passed:', testResponse.data);
    } catch (testError) {
      console.error('Backend test failed:', testError);
    }

 
    setFormData({ username: '', email: '', password: '', role: 'user' });
    
    alert('Registration successful! Please login with your credentials.');
    navigate('/login');
    
  } catch (err) {
    console.error('Registration error details:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      config: err.config
    });
    
    
    if (err.response?.data?.message?.includes('already exists')) {
      setError('An account with this email or username already exists.');
    } else if (err.code === 'ERR_NETWORK') {
      setError('Cannot connect to server. Make sure backend is running on port 3001.');
    } else {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Sign up for your CRM account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
          {error && (
            <div className="alert error">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="register-username">Username</label>
            <input
              ref={usernameRef}
              type="text"
              id="register-username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
              disabled={loading}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              minLength="3"/>
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email</label>
            <input
              ref={emailRef}
              type="email"
              id="register-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              disabled={loading}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"/>
          </div>

          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <input
              ref={passwordRef}
              type="password"
              id="register-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password (min. 6 characters)"
              disabled={loading}
              autoComplete="new-password"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              minLength="6"/>
          </div>

          <div className="form-group">
            <label htmlFor="register-role">Role</label>
            <select
              id="register-role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              autoComplete="off">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" className="btn primary full-width" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="link">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;