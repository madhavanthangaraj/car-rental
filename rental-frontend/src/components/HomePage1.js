import React from 'react';
import '../styles/HomePage1.css';
import { Car, Wallet, ShieldCheck, Smile, PhoneCall } from 'lucide-react';

const HomePage1 = () => {
  return (
    <div className="homepage1-wrapper">
      <header className="homepage1-header">
        <h1>DriveAway Rentals</h1>
        <p>Your ride, your rules – explore with confidence.</p>
        {/* <button className="cta-button"></button> */}
      </header>

      <section className="homepage1-section features">
        <h2>What Makes Us Unique?</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <Car className="feature-icon" />
            <h3>Flexible Rentals</h3>
            <p>Hourly, daily, or long-term – you choose the schedule.</p>
          </div>
          <div className="feature-card">
            <Wallet className="feature-icon" />
            <h3>Zero Deposit</h3>
            <p>Drive worry-free with no security deposit.</p>
          </div>
          <div className="feature-card">
            <ShieldCheck className="feature-icon" />
            <h3>Verified Vehicles</h3>
            <p>Regularly maintained and safety-checked cars only.</p>
          </div>
        </div>
      </section>

      <section className="homepage1-section testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonial-list">
          <div className="testimonial">
            <Smile className="testimonial-icon" />
            <p>“Absolutely loved the service! Car was clean and pickup was super easy.”</p>
            <span>- Priya R., Chennai</span>
          </div>
          <div className="testimonial">
            <Smile className="testimonial-icon" />
            <p>“Affordable rates and quick booking. My go-to for weekend trips.”</p>
            <span>- Aditya K., Bangalore</span>
          </div>
          <div className="testimonial">
            <Smile className="testimonial-icon" />
            <p>“The best rental experience I’ve had in India. Professional and smooth.”</p>
            <span>- Meera S., Coimbatore</span>
          </div>
        </div>
      </section>

      {/* <footer className="homepage1-footer">
        <PhoneCall className="footer-icon" />
        <p>Need Help? Call us at 1800-000-123</p>
        <p>© 2025 DriveAway Rentals. All rights reserved.</p>
      </footer> */}
    </div>
  );
};

export default HomePage1;
