import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


function Navbar() {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('authToken');

  const handleLogout = () => {
  
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Redirect to login page
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/dashboard">CRM System</Link>
      </div>
      
      <div className="nav-links">
    
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/customers">Customers</Link>
        <Link to="/add-customer">Add Customer</Link>
            <Link to="/register">Regsiter</Link>
        
        {/* Show Login or Logout based on authentication status */}
        {isAuthenticated ? (
          <button onClick={handleLogout} className="nav-logout-btn">
            Logout
          </button>
        ) : (
          <Link to="/login" className="nav-login-link">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;