import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // No token, redirect to login
    return <Navigate to="/login" replace />;
  }
  
  try {
    // Decode JWT token to check role
    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
    
    if (tokenPayload.role !== 'admin') {
      // Not an admin, redirect to login with error
      alert('Access denied. Admin privileges required.');
      return <Navigate to="/login" replace />;
    }
    
    // Valid admin token
    return children;
  } catch (error) {
    console.error('Invalid token:', error);
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

export default AdminProtectedRoute;