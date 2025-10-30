import React, { useState, useEffect } from 'react';

function CustomerForm({ initialData = {}, onSubmit, loading = false, isEdit = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active',
    ...initialData
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
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
          placeholder="Enter customer name"/>
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
          type="submit" 
          className="btn primary"
          disabled={loading}>
          {loading ? 'Saving...' : (isEdit ? 'Update Customer' : 'Add Customer')}
        </button>
      </div>
    </form>
  );
}

export default CustomerForm;