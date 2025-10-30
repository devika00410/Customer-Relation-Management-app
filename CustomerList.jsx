import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../Services/api';

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      console.log('Fetching customers from API...');   
      const response = await api.get('/customers');
      console.log('Customers fetched successfully:', response.data);
      setCustomers(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch error details:', err);
      setError('Failed to fetch customers. Please check if backend server is running on port 3000.');
      setLoading(false);
    }
  };

  
  const deleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await api.delete(`/customers/${customerId}`);
        setCustomers(customers.filter(customer => customer._id !== customerId));
        alert('Customer deleted successfully!');
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete customer. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">Loading customers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="error-message">
          <h3>Error Loading Customers</h3>
          <p>{error}</p>
          <button onClick={fetchCustomers} className="btn primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Customer Management</h1>
        <Link to="/add-customer" className="btn primary">
          + Add New Customer
        </Link>
      </div>

      {customers.length === 0 ? (
        <div className="empty-state">
          <h3>No Customers Found</h3>
          <p>Get started by adding your first customer to the CRM system.</p>
          <Link to="/add-customer" className="btn primary">
            Add Your First Customer
          </Link>
        </div>
      ) : (
        <div className="table-container">
          <div className="table-info">
            <p>Showing {customers.length} customer{customers.length !== 1 ? 's' : ''}</p>
          </div>
          <table className="customers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Created Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer._id}>
                  <td>
                    <div className="customer-name-cell">
                      <div className="customer-avatar-small">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      {customer.name}
                    </div>
                  </td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>
                    <span className={`status-badge ${customer.status?.toLowerCase()}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td>
                    {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Link 
                        to={`/edit-customer/${customer._id}`} 
                        className="btn btn-sm btn-edit">
                        Edit
                      </Link>
                      <button 
                        onClick={() => deleteCustomer(customer._id)}
                        className="btn btn-sm btn-delete">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CustomerList;