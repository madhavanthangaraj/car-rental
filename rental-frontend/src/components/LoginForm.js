import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/LoginForm.css';

const LoginForm = () => {
  const [form, setForm] = useState({ userName: '', password: '', remember: false, role: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      let data;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data = await res.text();
      }
      if (!res.ok) {
        throw new Error((data && data.error) || data || 'Login failed');
      }
      
      // Robust role validation: map frontend roles to backend roles
      const frontendToBackendRole = {
        admin: 'role_admin',
        user: 'role_user'
      };
      const selectedRole = (form.role || '').toLowerCase();
      const backendRoleValue = frontendToBackendRole[selectedRole];
      let backendRoles = [];
      if (Array.isArray(data.roles)) {
        backendRoles = data.roles.map(r => (r || '').toLowerCase());
      } else if (data.role) {
        backendRoles = [(data.role || '').toLowerCase()];
      }
      
      // Only block if backend returns roles and selected is not present
      if (
        selectedRole &&
        backendRoleValue &&
        backendRoles.length > 0 &&
        !backendRoles.includes(backendRoleValue)
      ) {
        setError('Role mismatch: You are not registered as ' + form.role + '. Please login with your registered role.');
        setLoading(false);
        return;
      }

      // Use auth context to handle login
      const token = data.token;
      const userRole = Array.isArray(data.roles) && data.roles.length > 0 ? data.roles[0] : data.role;
      
      if (token && userRole) {
        login(token, userRole);
        
        // Redirect based on actual user role from server - Admin goes to /home, User goes to /home1
        if (userRole && userRole.toLowerCase() === 'role_admin') {
          navigate('/home');
        } else {
          navigate('/home1');
        }
      } else {
        setError('Invalid login response from server');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <p style={{ color: '#444', marginBottom: 18, fontSize: '1.07rem' }}>
            Enter your credentials to access your account.
          </p>
          {error && <div className="error" style={{ marginBottom: 10 }}>{error}</div>}
          <div className="form-row">
            <label>Username</label>
            <input type="text" name="userName" placeholder="Enter your username" value={form.userName} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>Password</label>
            <input type="password" name="password" placeholder="********" value={form.password} onChange={handleChange} required />
          </div>
          <div className="form-row">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange} required>
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div className="login-row">
            <label className="remember-me">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                style={{ marginRight: 6 }}
              />
              Remember me
            </label>
            <a href="#" className="forgot-link">Forgot Password?</a>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="signup-link">
            Don't have an Account?
            <span onClick={() => navigate('/register')}>Sign Up</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
