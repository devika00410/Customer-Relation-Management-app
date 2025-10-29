import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // ✅ ADD Router
import './App.css';
import Dashboard from './Pages/Dashboard';
import CustomerList from './Pages/CustomerList';
import AddCustomer from './Pages/AddCustomer';
import EditCustomer from './Pages/EditCustomer';
import Navbar from './Components/Navbar';
import Register from './Pages/Register';
import Login from './Pages/Login';

function App() {
  return (
    <Router> {/* ✅ ADD THIS - Wrap entire app */}
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/add-customer" element={<AddCustomer />} />
            <Route path="/edit-customer/:id" element={<EditCustomer />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;