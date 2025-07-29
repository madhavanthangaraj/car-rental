import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header1 = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // If we're on car listing page, update the URL with search parameter
      if (location.pathname === '/car-listing1') {
        navigate(`/car-listing1?search=${encodeURIComponent(searchTerm.trim())}`);
      } else {
        // Navigate to car listing page with search parameter
        navigate(`/car-listing1?search=${encodeURIComponent(searchTerm.trim())}`);
      }
    } else {
      // Clear search if empty
      if (location.pathname === '/car-listing1') {
        navigate('/car-listing1');
      }
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <header className="ems-header">
      <nav className="ems-header__nav">
        <Link className="ems-header__link" to="/home1">HOME</Link>
        <Link className="ems-header__link" to="/about1">ABOUT US</Link>
        <Link className="ems-header__link" to="/car-listing1">CAR LISTING</Link>
        <Link className="ems-header__link" to="/my-cart">MY CART</Link>
        <Link className="ems-header__link" to="/contact1">CONTACT US</Link>
      </nav>
      <div className="ems-header__right">
        
        <form className="ems-header__search" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search cars..." 
            value={searchTerm}
            onChange={handleInputChange}
          />
          <button type="submit" aria-label="Search">
            {/* SVG search icon for a modern look */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ems-header__search-icon"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
        </form>
        <div className="ems-header__auth-buttons">
          
          <Link className="ems-header__btn" to="/logout">Logout</Link>
        </div>
      </div>
    </header>
  );
};

export default Header1;