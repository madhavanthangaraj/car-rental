import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  useEffect(() => {
    // Clear auth state using context
    logout();
    navigate('/'); // Go to landing page
  }, [navigate, logout]);
  
  return null;
};

export default Logout;
