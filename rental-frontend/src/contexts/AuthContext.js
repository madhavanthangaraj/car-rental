import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on app load
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    console.log('AuthContext - Checking authentication status...');
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      console.log('AuthContext - Found in localStorage:', { 
        hasToken: !!token, 
        tokenLength: token?.length || 0,
        role: role 
      });
      
      // Only set authenticated if BOTH token and role exist and are valid
      if (token && role && token.trim() !== '' && role.trim() !== '') {
        console.log('AuthContext - Valid credentials found, setting authenticated');
        setIsAuthenticated(true);
        setIsAdmin(role.toLowerCase() === 'role_admin');
      } else {
        console.log('AuthContext - Invalid or missing credentials, clearing auth state');
        // Clear any invalid/partial auth data
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Clear auth data on error
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      // Add a small delay to ensure proper state update
      setTimeout(() => {
        setLoading(false);
        console.log('AuthContext - Authentication check complete');
      }, 100);
    }
  };

  const login = (token, role) => {
    console.log('AuthContext - Logging in user:', { token: !!token, role });
    
    if (!token || !role) {
      console.error('AuthContext - Invalid login credentials provided');
      return false;
    }
    
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setIsAuthenticated(true);
    setIsAdmin(role.toLowerCase() === 'role_admin');
    console.log('AuthContext - User logged in successfully:', { 
      isAdmin: role.toLowerCase() === 'role_admin' 
    });
    return true;
  };

  const logout = () => {
    console.log('AuthContext - Logging out user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setIsAdmin(false);
    console.log('AuthContext - User logged out successfully');
  };

  const value = {
    isAuthenticated,
    isAdmin,
    loading,
    login,
    logout,
    checkAuthStatus
  };

  console.log('AuthContext - Current state:', { isAuthenticated, isAdmin, loading });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
