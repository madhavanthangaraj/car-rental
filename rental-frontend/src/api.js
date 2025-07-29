// Centralized API utility to always send JWT token if present
export function apiFetch(url, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': 'application/json',
  };
  return fetch(url, { ...options, headers });
}

// Send confirmation email after successful payment
export async function sendConfirmationEmail(bookingDetails) {
  try {
    const response = await apiFetch('http://localhost:8080/bookings/send-confirmation-email', {
      method: 'POST',
      body: JSON.stringify(bookingDetails)
    });
    
    if (!response.ok) {
      throw new Error('Failed to send confirmation email');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
}
