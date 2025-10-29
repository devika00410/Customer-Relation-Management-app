import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../Services/api';
import './AddCustomer.css'; 

function EditCustomer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      console.log('Fetching customer with ID:', id);
      const response = await api.get(`/customers/${id}`);
      console.log('Customer data received:', response.data);
      setFormData(response.data);
      setDataLoading(false);
    } catch (err) {
      console.error('Error fetching customer:', err);
      setError('Failed to fetch customer data: ' + (err.response?.data?.message || err.message));
      setDataLoading(false);
    }
  };

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
      console.log('Updating customer with data:', formData);
      const response = await api.patch(`/customers/${id}`, formData);
      console.log('Update response:', response.data);
      
      alert('Customer updated successfully!');
      navigate('/customers');
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to update customer');
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="page">
        <div className="loading">Loading customer data...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Edit Customer</h1>
        <div className="page-header-actions">
          <button onClick={() => navigate('/customers')} className="btn">
            ← Back to Customers
          </button>
        </div>
      </div>

      {error && (
        <div className="alert error">
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="customer-form">
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter customer name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter email address"/>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter phone number"/>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/customers')}
            className="btn">
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn primary"
            disabled={loading}>
            {loading ? 'Updating...' : 'Update Customer'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCustomer;