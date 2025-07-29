import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  // Block access if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Block access if admin required but user is not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  // Allow access only if authenticated
  return children;
};

export default ProtectedRoute;
