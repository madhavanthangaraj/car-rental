import React, { useState, useEffect } from 'react';
import Header1 from './Header1';
import '../styles/MyCartPage.css'
import { sendConfirmationEmail } from '../api';

const MyCartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [completedRentals, setCompletedRentals] = useState([]);

  useEffect(() => {
    // Load cart items from localStorage
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }

    // Load completed rentals from localStorage
    const savedCompletedRentals = localStorage.getItem('completedRentals');
    if (savedCompletedRentals) {
      setCompletedRentals(JSON.parse(savedCompletedRentals));
    }
  }, []);

  const removeFromCart = (bookingId) => {
    const updatedItems = cartItems.filter(item => item.bookingId !== bookingId);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const removeCompletedRental = (index) => {
    const updatedCompletedRentals = completedRentals.filter((_, i) => i !== index);
    setCompletedRentals(updatedCompletedRentals);
    localStorage.setItem('completedRentals', JSON.stringify(updatedCompletedRentals));
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => {
      const itemCost = parseFloat(item.totalCost) || 0;
      return total + itemCost;
    }, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    setLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentDate = new Date().toLocaleDateString();
      const paymentTime = new Date().toLocaleTimeString();
      
      // Send confirmation emails for each booking
      const emailPromises = cartItems.map(async (item) => {
        const emailData = {
          carName: item.carName,
          customerName: item.customerName,
          customerEmail: item.customerEmail,
          startDate: item.startDate,
          numberOfDays: item.numberOfDays,
          perDayCost: item.perDayCost,
          totalCost: item.totalCost,
          paymentDate: paymentDate
        };
        
        try {
          await sendConfirmationEmail(emailData);
          console.log(`Confirmation email sent to ${item.customerEmail}`);
        } catch (error) {
          console.error(`Failed to send email to ${item.customerEmail}:`, error);
          // Don't fail the entire checkout if email fails
        }
      });
      
      // Wait for all emails to be sent (or fail)
      await Promise.allSettled(emailPromises);
      
      alert(`Payment successful! Total amount: $${getTotalAmount()}\nConfirmation emails have been sent to all customers.`);
      
      // Move cart items to completed rentals
      const newCompletedRentals = cartItems.map(item => ({
        ...item,
        paymentDate: paymentDate,
        paymentTime: paymentTime,
        status: 'Paid'
      }));
      
      const existingCompletedRentals = JSON.parse(localStorage.getItem('completedRentals') || '[]');
      const updatedCompletedRentals = [...existingCompletedRentals, ...newCompletedRentals];
      
      setCompletedRentals(updatedCompletedRentals);
      localStorage.setItem('completedRentals', JSON.stringify(updatedCompletedRentals));
      
      // Clear cart
      setCartItems([]);
      localStorage.removeItem('cartItems');
      
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header1 />
      <div className="cart-container">
        <h2>My Cart</h2>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <p>Book a car to see it here!</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.bookingId} className="cart-item">
                  <div className="cart-item-details">
                    <h3>{item.carName}</h3>
                    <div className="booking-info">
                      <p><strong>Start Date:</strong> {item.startDate}</p>
                      <p><strong>Number of Days:</strong> {item.numberOfDays}</p>
                      <p><strong>Per Day Cost:</strong> ${item.perDayCost}</p>
                      <p><strong>Total Cost:</strong> ${item.totalCost}</p>
                      <p><strong>Customer:</strong> {item.customerName}</p>
                      <p><strong>Email:</strong> {item.customerEmail}</p>
                    </div>
                  </div>
                  <div className="cart-item-actions">
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCart(item.bookingId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="total-amount">
                <h3>Total Amount: ${getTotalAmount()}</h3>
              </div>
              <div className="checkout-actions">
                <button 
                  className="checkout-btn"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Completed Rentals Section */}
        {completedRentals.length > 0 && (
          <div className="completed-rentals-section">
            <h2>Completed Rentals</h2>
            <div className="completed-rentals-list">
              {completedRentals.map((rental, index) => (
                <div key={`completed-rental-${index}-${rental.paymentDate || Date.now()}`} className="completed-rental-item">
                  <div className="rental-info">
                    <h4>{rental.carName}</h4>
                    <p><strong>Rented by:</strong> {rental.customerName}</p>
                    <p><strong>Email:</strong> {rental.customerEmail}</p>
                    <p><strong>Rental Period:</strong> {rental.startDate} ({rental.numberOfDays} days)</p>
                    <p><strong>Amount Paid:</strong> ${rental.totalCost}</p>
                    <p><strong>Payment Date:</strong> {rental.paymentDate} at {rental.paymentTime}</p>
                  </div>
                  <div className="rental-status">
                    <span className="status-badge paid">PAID</span>
                    <button 
                      className="remove-completed-btn"
                      onClick={() => removeCompletedRental(index)}
                      title="Remove from history"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyCartPage;
