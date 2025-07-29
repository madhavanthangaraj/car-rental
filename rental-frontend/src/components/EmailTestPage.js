import React, { useState } from 'react';

const EmailTestPage = () => {
  const [email, setEmail] = useState('madhavan8610331381@gmail.com');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const testEmail = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('http://localhost:8080/bookings/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setMessage(`✅ Success: ${result.message}`);
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Email Test Page</h2>
      <div style={{ marginBottom: '20px' }}>
        <label>Email Address:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '10px', 
            marginTop: '5px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
      </div>
      
      <button
        onClick={testEmail}
        disabled={loading}
        style={{
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Sending...' : 'Send Test Email'}
      </button>
      
      {message && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: message.includes('Success') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${message.includes('Success') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          color: message.includes('Success') ? '#155724' : '#721c24'
        }}>
          {message}
        </div>
      )}
      
      <div style={{ marginTop: '30px', fontSize: '14px', color: '#666' }}>
        <h3>Troubleshooting Steps:</h3>
        <ol>
          <li>Make sure your backend server is running on port 8080</li>
          <li>Check that you've generated a Gmail App Password (not regular password)</li>
          <li>Verify 2-Factor Authentication is enabled on your Gmail account</li>
          <li>Check the backend console logs for detailed error messages</li>
          <li>Make sure the App Password has no spaces</li>
        </ol>
      </div>
    </div>
  );
};

export default EmailTestPage;
