import React from 'react';
import '../styles/AboutPage.css';
import Header from './Header';
const AboutUsPage = () => {
  return (
    

    <div className="about-wrapper">
         <Header />
      <header className="about-header">
        <h1>About Carly Rent</h1>
        <p>Your Trusted Partner in Car Rentals</p>
      </header>

      <section className="about-section mission">
        <h2>Our Mission</h2>
        <p>
          At Carly Rent, our mission is to revolutionize the car rental experience by combining reliability, affordability, and innovation. 
          Whether you're traveling for business, leisure, or daily needs, we provide you with safe and quality-assured vehicles at competitive prices.
        </p>
      </section>

      <section className="about-section features">
        <h2>Why Choose Us</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>Wide Range of Vehicles</h3>
            <p>From economy hatchbacks to premium SUVs and sedans, we offer vehicles that fit every need and budget.</p>
          </div>
          <div className="feature-card">
            <h3>Easy Booking</h3>
            <p>Book your vehicle in just a few clicks. Our user-friendly interface and real-time availability help you save time.</p>
          </div>
          <div className="feature-card">
            <h3>Transparent Pricing</h3>
            <p>No hidden charges. What you see is what you pay. Fully transparent pricing with flexible rental durations.</p>
          </div>
          <div className="feature-card">
            <h3>24/7 Support</h3>
            <p>Need help on the road or have a query? Our dedicated support team is just a call or message away—24/7.</p>
          </div>
        </div>
      </section>

      <section className="about-section values">
        <h2>Our Core Values</h2>
        <ul>
          <li><strong>Customer Satisfaction:</strong> Your comfort and safety come first.</li>
          <li><strong>Integrity:</strong> Transparent practices and honest service.</li>
          <li><strong>Innovation:</strong> Continuously improving through technology.</li>
          <li><strong>Sustainability:</strong> Introducing eco-friendly cars to reduce our carbon footprint.</li>
        </ul>
      </section>

      <section className="about-section team">
        <h2>Meet the Team</h2>
        <p>
          We are a passionate group of developers, designers, and automotive professionals working together to make car rental smarter and more accessible.
        </p>
      </section>

      <section className="about-section future">
        <h2>What's Next?</h2>
        <p>
          We're expanding to new cities, adding electric cars to our fleet, and building smarter features like real-time tracking and predictive maintenance.
          Join us on this exciting ride!
        </p>
      </section>
    </div>
  );
};

export default AboutUsPage;
