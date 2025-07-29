import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DHeader.css';

const DHeader = () => {
  const navigate = useNavigate();
  return (
    <header className="dheader">
      <div className="dheader-left"><span className="dheader-bold">C🚗rly</span><span className="dheader-bold"> Rent</span></div>
      <div className="dheader-right"><div className="dheader-bold">
        <button className="dheader-login-btn" onClick={() => navigate('/login')}>Login</button></div>
      </div>
    </header>
  );
};

export default DHeader;
