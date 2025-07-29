import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl } from '../config/api';
import '../styles/RegisterForm.css';

const roleOptions = [
  { label: 'Admin', value: 'ROLE_ADMIN' },
  { label: 'User', value: 'ROLE_USER' }
];

const RegisterForm = () => {
  const [form, setForm] = useState({
    name: '',
    userName: '',
    email: '',
    password: '',
    roleNames: ['ROLE_USER']
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <form className="register-form" onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError('');
          setSuccess('');
          try {
            const res = await fetch(buildApiUrl('/api/auth/register'), {
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
              throw new Error((data && data.error) || data || 'Registration failed');
            }
            setSuccess('Registration successful! You can now login.');
            setTimeout(() => navigate('/login'), 1500);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        }}>
          <h2>Register</h2>
          <p style={{ color: '#444', marginBottom: 18, fontSize: '1.07rem' }}>
            Create your account to get started.
          </p>
          {error && <div className="error" style={{ marginBottom: 10 }}>{error}</div>}
          {success && <div className="success" style={{ marginBottom: 10, color: '#388e3c', fontWeight: 600 }}>{success}</div>}
          <div className="form-row">
            <label>Name</label>
            <input type="text" name="name" placeholder="Enter your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          </div>
          <div className="form-row">
            <label>Username</label>
            <input type="text" name="userName" placeholder="Enter your username" value={form.userName} onChange={e => setForm(f => ({ ...f, userName: e.target.value }))} required />
          </div>
          <div className="form-row">
            <label>Email</label>
            <input type="email" name="email" placeholder="Enter your email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="form-row">
            <label>Password</label>
            <input type="password" name="password" placeholder="********" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          <div className="form-row">
            <label>Role</label>
            <select name="roleNames" value={form.roleNames[0]} onChange={e => setForm(f => ({ ...f, roleNames: [e.target.value] }))} required>
              {roleOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          <div className="signup-link">
            Already have an account?
            <span onClick={() => navigate('/login')}>Login</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
