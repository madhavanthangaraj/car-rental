import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: "Premium Car Rentals",
      subtitle: "Experience luxury and comfort with our premium fleet",
      image: "🚗"
    },
    {
      title: "Affordable Rates",
      subtitle: "Best prices guaranteed for all your travel needs",
      image: "💰"
    },
    {
      title: "24/7 Support",
      subtitle: "Round-the-clock assistance for a seamless experience",
      image: "🛠️"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>🏆 #1 Car Rental Service</span>
            </div>
            <h1 className="hero-title">
              Welcome to <span className="brand-highlight">C🚗rly Rent</span>
            </h1>
            <div className="hero-slider">
              <div className="slide-content">
                <div className="slide-icon">{heroSlides[currentSlide].image}</div>
                <h2>{heroSlides[currentSlide].title}</h2>
                <p>{heroSlides[currentSlide].subtitle}</p>
              </div>
            </div>
            <div className="hero-buttons">
              <button className="cta-primary" onClick={() => navigate('/register')}>
                Get Started Free
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">4.9★</span>
                <span className="stat-label">Rating</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Customers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Cars</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="floating-car">🚗</div>
          <div className="floating-car">🚙</div>
          <div className="floating-car">🏎️</div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;