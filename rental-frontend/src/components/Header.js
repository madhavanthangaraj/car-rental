import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="ems-header">
      <nav className="ems-header__nav">
        <Link className="ems-header__link" to="/home">HOME</Link>
        <Link className="ems-header__link" to="/about">ABOUT US</Link>
        <Link className="ems-header__link" to="/car-listing">CAR LISTING</Link>
        <Link className="ems-header__link" to="/add-car">ADD CARS</Link>
        <Link className="ems-header__link" to="/contact">CONTACT US</Link>
      </nav>
      <div className="ems-header__right">
        
        <form className="ems-header__search">
  <input type="text" placeholder="Search..." />
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

export default Header;