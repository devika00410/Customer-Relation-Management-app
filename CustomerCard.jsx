import React from 'react';
import { Link } from 'react-router-dom';

function CustomerCard({ customer }) {
  return (
    <div className="customer-card">
      <div className="customer-header">
        <div className="customer-avatar">
          {customer.name.charAt(0).toUpperCase()}
        </div>
        <div className="customer-info">
          <h4>{customer.name}</h4>
          <p>{customer.email}</p>
        </div>
      </div>
      
      <div className="customer-details">
        <p><strong>Phone:</strong> {customer.phone}</p>
        <p><strong>Status:</strong> 
          <span className={`status ${customer.status.toLowerCase()}`}>
            {customer.status}
          </span>
        </p>
        <p><strong>Since:</strong> {new Date(customer.createdAt).toLocaleDateString()}</p>
      </div>
      
      <div className="customer-actions">
        <Link to={`/edit-customer/${customer._id}`} className="btn sm">
          Edit
        </Link>
        <Link to={`/customers/${customer._id}`} className="btn sm">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default CustomerCard;