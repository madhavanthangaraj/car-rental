import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';
import { apiFetch } from '../api';
import '../styles/HomePage.css';

const HomePage = () => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ brand: '', model: '' });
  const [displayRentalCar, setDisplayRentalCar] = useState(null);

  // Display rentalcar details
  const handleDisplayRentalCar = (car) => {
    setDisplayRentalCar(car);
  };
  const closeDisplayRentalCar = () => setDisplayRentalCar(null);

  // Start editing an rentalcar
  const startEdit = (car) => {
    setEditingId(car.carId);
    setEditData({ brand: car.brand, model: car.model });
  };

  // Cancel editing
  const cancelEdit = (e) => {
    if (e) e.preventDefault();
    setEditingId(null);
    setEditData({ brand: '', model: '' });
  };

  // Update rentalcar handler
  const handleUpdateRentalCar = (carId) => {
    fetch(`/rentalcars/${carId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
      body: JSON.stringify(editData)
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then(text => {
            alert(`Failed to update rentalcar. Status: ${response.status}. Body: ${text}`);
            throw new Error(text);
          });
        }
        setRentalCars((prev) => prev.map(car =>
          car.carId === carId ? { ...car, ...editData } : car
        ));
        setEditingId(null);
        setEditData({ brand: '', model: '' });
      })
      .catch((error) => {
        alert('Error updating rentalcar: ' + error.message);
      });
  };

  // Delete rentalcar handler
  const handleDeleteRentalCar = (carId, brand) => {
    if (!window.confirm(`Are you sure you want to delete rentalcar '${brand}' (ID: ${carId})?`)) return;
    fetch(`/rentalcars/${carId}`, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
      .then((response) => {
        if (!response.ok) {
          return response.text().then(text => {
            alert(`Failed to delete rentalcar. Status: ${response.status}. Body: ${text}`);
            throw new Error(text);
          });
        }
        setRentalCars((prev) => prev.filter(car => car.carId !== carId));
      })
      .catch((error) => {
        alert('Error deleting rentalcar: ' + error.message);
      });
  };

  const [rentalCars, setRentalCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRentalCarList, setShowRentalCarList] = useState(false);

  const navigate = useNavigate();

  // Show RentalCars handler
  const handleShowRentalCars = () => {
    setShowRentalCarList(true);
    setLoading(true);
    setError(null);
    setRentalCars([]);
    apiFetch('/rentalcars', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then((response) => {
        console.log('Fetch /rentalcar status:', response.status);
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`Network response was not ok. Status: ${response.status}. Body: ${text}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        setRentalCars(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <div className="home-dark-bg">
      <section className="home-hero-section">
  <div className="home-hero-overlay">
  <div className="home-hero-gradient"></div>
  <h1 className="home-hero-title">Drive Your Business Forward</h1>
  <p className="home-hero-desc">Manage your fleet, add new cars, and keep your rental business rolling in style.</p>
  {/* <button className="home-btn home-cta-btn" onClick={() => navigate('/add-car')}>Add Car</button> */}
</div>
  <img className="home-hero-img" src="/car-hero.jpg" alt="Car Rental" />
</section>
<section className="home-features-section">
  <div className="home-feature-card">
    <img src="https://img.icons8.com/ios-filled/100/1976d2/car--v1.png" alt="Wide Range" />
    <h3>Wide Range of Cars</h3>
    <p>Choose from economy to luxury vehicles for every occasion.</p>
  </div>
  <div className="home-feature-card">
    <img src="https://img.icons8.com/ios-filled/100/1976d2/calendar--v1.png" alt="Easy Booking" />
    <h3>Easy Booking</h3>
    <p>Book your car in minutes with our simple online system.</p>
  </div>
  <div className="home-feature-card">
    <img src="https://img.icons8.com/ios-filled/100/1976d2/phone-disconnected.png" alt="24/7 Support" />
    <h3>24/7 Support</h3>
    <p>We're here for you, anytime, anywhere.</p>
  </div>
</section>
      {/* <div className="landing-content">
        <h2 style={{color:'#fff'}}>Car Management</h2>
        <button className="home-btn" onClick={() => navigate('/car-list')}>Show Cars</button>
        
        {displayRentalCar && (
          <div style={{marginTop:'24px',padding:'20px',background:'#f6f6fa',borderRadius:'8px',boxShadow:'0 2px 8px rgba(0,0,0,0.08)',maxWidth:'400px'}}>
            <h3>Car Details</h3>
            <p><strong>Car ID:</strong> {displayRentalCar.carId}</p>
            <p><strong>Brand:</strong> {displayRentalCar.brand}</p>
            <p><strong>Model:</strong> {displayRentalCar.model}</p>
            <p><strong>Type:</strong> {displayRentalCar.carType}</p>
            <p><strong>Fuel:</strong> {displayRentalCar.fuelType}</p>
            <p><strong>Transmission:</strong> {displayRentalCar.transmission}</p>
            <p><strong>Seating:</strong> {displayRentalCar.seatingCapacity}</p>
            <p><strong>Price/Day:</strong> {displayRentalCar.rentalPricePerDay}</p>
            <p><strong>Status:</strong> {displayRentalCar.availabilityStatus}</p>
            <p><strong>Location:</strong> {displayRentalCar.location}</p>
            <p><strong>Features:</strong> {displayRentalCar.features && displayRentalCar.features.join(', ')}</p>
            <button style={{marginTop:'12px',background:'#aaa',color:'#fff',border:'none',padding:'6px 16px',borderRadius:'5px',cursor:'pointer'}} onClick={closeDisplayRentalCar}>Close</button>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default HomePage;
