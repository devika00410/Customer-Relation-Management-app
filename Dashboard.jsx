import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../Services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeCustomers: 0,
    recentCustomers: []
  });
  const [userRole, setUserRole] = useState('user');
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('userData');
    const authToken = localStorage.getItem('authToken');
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role || 'user');
        setUserName(user.username || user.email || 'User');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('authToken');
      
      if (token) {
        try {
          const customersResponse = await api.get('/customers');
          const customers = customersResponse.data || [];
          
          const activeCustomers = customers.filter(customer => 
            customer.status === 'Active' || customer.status === 'active'
          ).length;
          
          // Get recent customers
          const recentCustomers = customers
            .sort((a, b) => new Date(b.createdAt || new Date()) - new Date(a.createdAt || new Date()))
            .slice(0, 5);
          
          setStats({
            totalCustomers: customers.length,
            activeCustomers: activeCustomers,
            recentCustomers: recentCustomers
          });
        } catch (apiError) {
          console.log('Using mock data due to API error:', apiError);
  
          setMockData();
        }
      } else {

        setMockData();
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    setStats({
      totalCustomers: 12,
      activeCustomers: 8,
      recentCustomers: [
        { _id: 1, name: "John Doe", email: "john@email.com", status: "active" },
        { _id: 2, name: "Jane Smith", email: "jane@email.com", status: "active" },
        { _id: 3, name: "Mike Johnson", email: "mike@email.com", status: "inactive" }
      ]
    });
  };

  const getWelcomeMessage = () => {
    const hours = new Date().getHours();
    let greeting = 'Welcome';
    
    if (hours < 12) greeting = 'Good morning';
    else if (hours < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';

    return `${greeting}, ${userName}`;
  };

  const getRoleBadge = () => {
    const roleConfig = {
      admin: { label: 'Administrator', class: 'admin-badge', emoji: '👑' },
      user: { label: 'User', class: 'user-badge', emoji: '👤' },
      manager: { label: 'Manager', class: 'manager-badge', emoji: '💼' }
    };
    
    const config = roleConfig[userRole] || roleConfig.user;
    
    return (
      <span className={`role-badge ${config.class}`}>
        {config.emoji} {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <p className="welcome-text">{getWelcomeMessage()}</p>
          {getRoleBadge()}
        </div>
        
        {userRole === 'admin' && (
          <div className="admin-actions">
            <Link to="/admin-settings" className="btn sm">
               Admin Settings
            </Link>
          </div>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>{stats.totalCustomers}</h3>
            <p>Total Customers</p>
            {userRole === 'admin' && (
              <span className="stat-trend">+2 this week</span>
            )}
          </div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <h3>{stats.activeCustomers}</h3>
            <p>Active Customers</p>
            <span className="stat-trend">
              {stats.totalCustomers > 0 
                ? Math.round((stats.activeCustomers / stats.totalCustomers) * 100) 
                : 0
              }% active
            </span>
          </div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <h3>{stats.recentCustomers.length}</h3>
            <p>Recent Additions</p>
            <span className="stat-trend">Last 7 days</span>
          </div>
        </div>

        <div className="stat-card info">
          <div className="stat-icon"></div>
          <div className="stat-info">
            <h3>{stats.totalCustomers > 0 ? '92%' : '0%'}</h3>
            <p>Customer Satisfaction</p>
            <span className="stat-trend">+5% this month</span>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <div className="section-header">
            <h2>Recent Customers</h2>
            <Link to="/customers" className="view-all-btn">
              View All →
            </Link>
          </div>
          
          {stats.recentCustomers.length > 0 ? (
            <div className="customers-list">
              {stats.recentCustomers.map(customer => (
                <div key={customer._id} className="customer-item">
                  <div className="customer-avatar">
                    {customer.name ? customer.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                  <div className="customer-details">
                    <h4>{customer.name || 'Unknown Customer'}</h4>
                    <p>{customer.email || 'No email provided'}</p>
                    {customer.phone && (
                      <small className="customer-phone">{customer.phone}</small>
                    )}
                  </div>
                  <div className="customer-meta">
                    <span className={`status-badge ${(customer.status || 'active').toLowerCase()}`}>
                      {customer.status || 'Active'}
                    </span>
                    {customer.createdAt && (
                      <small className="customer-date">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </small>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No customers found. <Link to="/add-customer">Add your first customer</Link></p>
            </div>
          )}
        </div>

        <div className="content-section">
          <div className="section-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <Link to="/add-customer" className="action-btn primary">
               Add New Customer
            </Link>
            <Link to="/customers" className="action-btn secondary">
               View All Customers
            </Link>
            
            {userRole === 'admin' && (
              <>
                <button className="action-btn secondary">
                   Generate Report
                </button>
                <Link to="/user-management" className="action-btn secondary">
                   Manage Users
                </Link>
              </>
            )}
            
            <button className="action-btn secondary" onClick={fetchDashboardData}>
               Refresh Data
            </button>
          </div>

          {/* Admin-only statistics */}
          {userRole === 'admin' && (
            <div className="admin-stats">
              <h3>Admin Overview</h3>
              <div className="admin-stats-grid">
                <div className="admin-stat">
                  <span className="stat-value">3</span>
                  <span className="stat-label">Active Users</span>
                </div>
                <div className="admin-stat">
                  <span className="stat-value">15</span>
                  <span className="stat-label">Total Contacts</span>
                </div>
                <div className="admin-stat">
                  <span className="stat-value">85%</span>
                  <span className="stat-label">System Health</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;