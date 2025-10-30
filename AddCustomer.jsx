import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Services/api';
import CustomerForm from '../Components/CustomerForm';
import './AddCustomer.css';

function AddCustomer() {
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (!token) {
      alert('Please login first to add customers.');
      navigate('/login');
      return false;
    }

    if (userData) {
      const user = JSON.parse(userData);
      setUserRole(user.role);
    }
    
    setAuthChecked(true);
    return true;
  };

  const handleSubmit = async (formData) => {
  console.log('Starting AddCustomer submission...');
  
  
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('userData');
  
  console.log('Current auth status:');
  console.log('   - Token:', token ? `Yes (${token.length} chars)` : 'No');
  console.log('   - User Data:', userData || 'No');
  
  if (!token) {
    alert('Please login first to add customers!');
    navigate('/login');
    return;
  }
  
  setLoading(true);
  try {
    console.log('Sending customer data:', formData);
    console.log('User role:', userRole);
    
    console.log('Testing token before making request...');
    try {
      const testResponse = await api.get('/auth/profile');
      console.log('Token test successful:', testResponse.data);
    } catch (testError) {
      console.error('Token test failed:', testError);
      throw new Error('Token validation failed');
    }
    
   
    const response = await api.post('/customers', formData);
    console.log('Customer added successfully:', response.data);
    
    alert('Customer added successfully!');
    navigate('/customers');
    
  } catch (err) {
    console.error('AddCustomer Error Details:', {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      config: {
        url: err.config?.url,
        method: err.config?.method,
        headers: err.config?.headers
      }
    });
    
    if (err.response?.status === 401) {
      console.log('401 Error - Clearing auth data');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      alert('Session expired. Please login again.');
      navigate('/login');
    } else if (err.response?.status === 403) {
      alert(`Access Denied! Admin privileges required. Your role: ${userRole}`);
      navigate('/customers');
    } else if (err.code === 'ERR_NETWORK') {
      alert('Cannot connect to server. Please check if backend is running.');
    } else {
      alert('Failed to add customer: ' + (err.response?.data?.error || err.message));
    }
  } finally {
    setLoading(false);
  }
};

  if (!authChecked) {
    return (
      <div className="page">
        <div className="loading">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Add New Customer</h1>
        <div>
          <span className={`role-badge ${userRole === 'admin' ? 'admin-badge' : 'user-badge'}`}>
            {userRole}
          </span>
          <button onClick={() => navigate('/customers')} className="btn">
            ← Back to List
          </button>
        </div>
      </div>

      {userRole !== 'admin' && (
        <div className="alert warning">
          <strong>Limited Access</strong> — Admin privileges required to add customers.
        </div>
      )}
      
      <CustomerForm 
        onSubmit={handleSubmit}
        loading={loading}
        isEdit={false}
        disabled={userRole !== 'admin'}
      />
    </div>
  );
}

export default AddCustomer;