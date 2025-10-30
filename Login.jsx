import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../Services/api';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    setFormData({
      email: '',
      password: ''
    });

    setTimeout(() => {
      if (emailRef.current) emailRef.current.value = "";
      if (passwordRef.current) passwordRef.current.value = "";
    }, 150);
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
    console.log('Login attempt with:', { email: formData.email });
    
    const response = await api.post('/auth/login', formData);
    console.log('Login response:', response.data);

    if (!response.data.token) {
      throw new Error('No authentication token received');
    }


    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('userData', JSON.stringify(response.data.user));
    
    console.log('Token stored, testing authentication...');
    
    
    try {
      const testResponse = await api.get('/auth/profile');
      console.log('Authentication test passed:', testResponse.data);
    } catch (testError) {
      console.error('Authentication test failed:', testError);
      throw new Error('Token validation failed after login');
    }

    navigate('/dashboard');

  } catch (err) {
    console.error('Login failed:', err.response?.data || err.message);
    
    
    if (err.response?.status === 400) {
      if (err.response.data?.message === "User not found") {
        setError('No account found with this email address');
      } else if (err.response.data?.message === "Invalid password") {
        setError('Incorrect password');
      } else {
        setError(err.response.data?.message || 'Invalid credentials');
      }
    } else if (err.response?.status === 401) {
      setError('Invalid email or password');
    } else if (err.code === 'ERR_NETWORK') {
      setError('Cannot connect to server. Please check if backend is running.');
    } else {
      setError(err.message || 'Login failed. Please try again.');
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your CRM account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
          {error && (
            <div className="alert error">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              ref={emailRef}
              type="email"
              id="login-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              disabled={loading}
              autoComplete="off"/>
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              ref={passwordRef}
              type="password"
              id="login-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              disabled={loading}
              autoComplete="new-password"/>
          </div>

          <button type="submit" className="btn primary full-width" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="link">
                Create one here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;