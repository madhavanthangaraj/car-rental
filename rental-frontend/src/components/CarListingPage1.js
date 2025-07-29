import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header1';
import { apiFetch } from '../api';
import { buildApiUrl } from '../config/api';
import '../styles/CarListingPage1.css';
import { FaHeart } from 'react-icons/fa';

// Image component with CORS handling
const CarImage = ({ car }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    console.log(`Image loaded successfully for car ${car.carId}: ${car.imageUrl}`);
  };

  const handleImageError = () => {
    setImageError(true);
    console.error(`Image failed to load for car ${car.carId}: ${car.imageUrl}`);
    console.error('This might be due to CORS policy or the image URL being invalid');
  };

  // Function to get a working image URL
  const getImageUrl = (originalUrl) => {
    if (!originalUrl || originalUrl.trim() === '') {
      return null;
    }

    // If it's a Pinterest URL or other problematic URL, use a placeholder
    if (originalUrl.includes('pinterest.com') || 
        originalUrl.includes('instagram.com') || 
        originalUrl.includes('facebook.com')) {
      // Use a car placeholder image from a CORS-friendly source
      return `https://via.placeholder.com/300x200/4CAF50/white?text=${encodeURIComponent(car.brand + ' ' + car.model)}`;
    }

    // For other URLs, try using a CORS proxy
    if (originalUrl.startsWith('http') && !originalUrl.includes('via.placeholder.com')) {
      return `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl)}&w=300&h=200&fit=cover`;
    }

    return originalUrl;
  };

  const imageUrl = getImageUrl(car.imageUrl);

  // If no image URL provided or failed to load
  if (!imageUrl || imageError) {
    return (
      <div className="car-image-placeholder">
        <span>{car.brand} {car.model}</span>
      </div>
    );
  }

  // Try to load the image
  return (
    <img 
      src={imageUrl} 
      alt={`${car.brand} ${car.model}`}
      className="car-image"
      onLoad={handleImageLoad}
      onError={handleImageError}
    />
  );
};

const CarListingPage = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    customerEmail: '',
    startDate: '',
    numberOfDays: 1
  });
  const [likeCounts, setLikeCounts] = useState({});
  const [userLikes, setUserLikes] = useState({});

  const location = useLocation();

  // Function to get search term from URL parameters
  const getSearchTerm = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get('search') || '';
  };

  // Function to filter cars based on search term
  const filterCars = (carsData, searchTerm) => {
    if (!searchTerm.trim()) {
      return carsData;
    }

    const term = searchTerm.toLowerCase().trim();
    return carsData.filter(car => 
      car.brand?.toLowerCase().includes(term) ||
      car.model?.toLowerCase().includes(term) ||
      car.carType?.toLowerCase().includes(term) ||
      car.fuelType?.toLowerCase().includes(term) ||
      car.transmission?.toLowerCase().includes(term) ||
      car.location?.toLowerCase().includes(term)
    );
  };

  // Update filtered cars when search term changes
  useEffect(() => {
    const searchTerm = getSearchTerm();
    const filtered = filterCars(cars, searchTerm);
    setFilteredCars(filtered);
  }, [cars, location.search]);

  // Load like data from backend API
  const loadLikeData = async (carIds) => {
    try {
      const response = await apiFetch(buildApiUrl('/api/car-likes/batch-counts'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ carIds })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setLikeCounts(data.likeCounts || {});
        }
      }
    } catch (error) {
      console.error('Error loading like data:', error);
    }
  };

  // Handle like toggle (backend API)
  const handleLike = async (carId) => {
    try {
      const response = await apiFetch(buildApiUrl(`/api/car-likes/increment/${carId}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Update like count in state
          setLikeCounts(prev => ({
            ...prev,
            [carId]: data.likeCount
          }));
        } else {
          alert(data.message || 'Failed to update like');
        }
      } else {
        alert('Failed to update like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Error updating like');
    }
  };

  const handleMoreDetails = (car) => {
    setSelectedCar(car);
  };

  const handleRentNow = async (car) => {
    if (car.availabilityStatus?.toLowerCase() !== 'available') {
      alert('This car is not available for booking.');
      return;
    }

    try {
      const response = await apiFetch(buildApiUrl(`/bookings/check-availability/${car.carId}?startDate=2024-01-01&numberOfDays=1`));
      const availabilityData = await response.json();
      
      if (availabilityData.available) {
        setSelectedCar(car);
        setShowBookingForm(true);
      } else {
        alert('Car is not available for the selected dates.');
      }
    } catch (err) {
      console.error('Availability check failed:', err);
      alert('Failed to check availability. Please try again.');
    }
  };

  const handleBookingSubmit = async () => {
    if (!bookingForm.customerName || !bookingForm.customerEmail || !bookingForm.startDate) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const bookingData = {
        carId: selectedCar.carId,
        customerName: bookingForm.customerName,
        customerEmail: bookingForm.customerEmail,
        startDate: bookingForm.startDate,
        numberOfDays: parseInt(bookingForm.numberOfDays)
      };

      const response = await apiFetch(buildApiUrl('/bookings/create'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Booking confirmed successfully!');
        
        // Add to cart
        const cartItem = {
          carId: selectedCar.carId,
          carName: `${selectedCar.brand} ${selectedCar.model}`,
          customerName: bookingForm.customerName,
          customerEmail: bookingForm.customerEmail,
          startDate: bookingForm.startDate,
          numberOfDays: parseInt(bookingForm.numberOfDays),
          pricePerDay: selectedCar.rentalPricePerDay,
          totalCost: selectedCar.rentalPricePerDay * parseInt(bookingForm.numberOfDays),
          bookingDate: new Date().toISOString().split('T')[0]
        };

        const existingCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
        existingCart.push(cartItem);
        localStorage.setItem('cartItems', JSON.stringify(existingCart));

        // Update car availability
        setCars(prevCars => 
          prevCars.map(car => 
            car.carId === selectedCar.carId 
              ? { ...car, availabilityStatus: 'Not Available' }
              : car
          )
        );

        setShowBookingForm(false);
        setSelectedCar(null);
        setBookingForm({ customerName: '', customerEmail: '', startDate: '', numberOfDays: 1 });
      } else {
        throw new Error(result.error || 'Booking failed');
      }
    } catch (err) {
      alert('Booking failed: ' + err.message);
    }
  };

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiFetch(buildApiUrl('/rentalcars'));
        const data = await response.json();
        setCars(data);
        
        // Load like data for all cars
        const carIds = data.map(car => car.carId);
        loadLikeData(carIds);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to load cars. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      setError(null);
      setLoading(false);
      return;
    }
    setIsLoggedIn(true);
    fetchCars();
  }, []);

  const searchTerm = getSearchTerm();
  const displayedCars = filteredCars;

  return (
    <>
      <Header />
      <div className="car-listing-container">
        <div className="car-listing-header">
          <h1>Premium Car Collection</h1>
          <p>Choose from our wide range of luxury vehicles</p>
          {searchTerm && (
            <div className="search-info">
              <p>Showing results for: "<strong>{searchTerm}</strong>" ({displayedCars.length} car{displayedCars.length !== 1 ? 's' : ''} found)</p>
              <button 
                className="clear-search-btn"
                onClick={() => window.location.href = '/car-listing1'}
              >
                Clear Search
              </button>
            </div>
          )}
        </div>

        {!isLoggedIn ? (
          <div className="login-prompt">
            <p>Please log in to view car listings.</p>
          </div>
        ) : loading ? (
          <div className="loading-container">
            <p>Loading amazing cars...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>Error: {error}</p>
          </div>
        ) : displayedCars.length === 0 && searchTerm ? (
          <div className="no-results-container">
            <h3>No cars found for "{searchTerm}"</h3>
            <p>Try searching with different keywords or browse all cars.</p>
            <button 
              className="browse-all-btn"
              onClick={() => window.location.href = '/car-listing1'}
            >
              Browse All Cars
            </button>
          </div>
        ) : (
          <div className={`cars-grid ${displayedCars.length === 1 ? 'single-result' : ''}`}>
            {displayedCars.map(car => (
              <div key={car.carId} className="car-card">
                <div className="car-image-container">
                  <CarImage car={car} />
                  <div className="car-status">
                    <span className={`status-badge ${car.availabilityStatus?.toLowerCase() === 'available' ? 'available' : 'unavailable'}`}>
                      {car.availabilityStatus || 'Unknown'}
                    </span>
                  </div>
                </div>
                
                <div className="car-details">
                  <h3 className="car-title">{car.brand}</h3>
                  <p className="car-model">{car.model}</p>
                  
                  <div className="car-features">
                    <div className="feature-item">
                      <span className="feature-icon">👥</span>
                      <span>{car.seatingCapacity} seats</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">⚙️</span>
                      <span>{car.transmission}</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">⛽</span>
                      <span>{car.fuelType}</span>
                    </div>
                  </div>

                  <div className="car-price">
                    <span className="price-amount">${car.rentalPricePerDay}</span>
                    <span className="price-period">/day</span>
                  </div>

                  <div className="car-actions">
                    <button 
                      className="btn-more" 
                      onClick={() => handleMoreDetails(car)}
                    >
                      More
                    </button>
                    <button 
                      className={`btn-rent ${car.availabilityStatus?.toLowerCase() === 'available' ? 'available' : 'disabled'}`}
                      onClick={() => handleRentNow(car)}
                      disabled={car.availabilityStatus?.toLowerCase() !== 'available'}
                    >
                      Rent Now
                    </button>
                    <button 
                      className={`btn-like ${userLikes[car.carId] ? 'liked' : ''}`}
                      onClick={() => handleLike(car.carId)}
                    >
                      <FaHeart />
                      <span className="like-count">{likeCounts[car.carId] || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Car Details Modal */}
        {selectedCar && !showBookingForm && (
          <div className="modal-overlay" onClick={() => setSelectedCar(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedCar.brand} {selectedCar.model}</h2>
                <button className="close-btn" onClick={() => setSelectedCar(null)}>×</button>
              </div>
              <div className="modal-body">
                <div className="car-image-large">
                  <CarImage car={selectedCar} />
                </div>
                <div className="car-info">
                  <p><strong>Type:</strong> {selectedCar.carType}</p>
                  <p><strong>Fuel:</strong> {selectedCar.fuelType}</p>
                  <p><strong>Transmission:</strong> {selectedCar.transmission}</p>
                  <p><strong>Seating:</strong> {selectedCar.seatingCapacity} people</p>
                  <p><strong>Location:</strong> {selectedCar.location}</p>
                  <p><strong>Price:</strong> ${selectedCar.rentalPricePerDay}/day</p>
                  {selectedCar.features && (
                    <p><strong>Features:</strong> {selectedCar.features.join(', ')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && (
          <div className="modal-overlay" onClick={() => setShowBookingForm(false)}>
            <div className="modal-content booking-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Book {selectedCar.brand} {selectedCar.model}</h2>
                <button className="close-btn" onClick={() => setShowBookingForm(false)}>×</button>
              </div>
              <div className="modal-body">
                <form className="booking-form">
                  <div className="form-group">
                    <label>Customer Name:</label>
                    <input
                      type="text"
                      value={bookingForm.customerName}
                      onChange={(e) => setBookingForm({...bookingForm, customerName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      value={bookingForm.customerEmail}
                      onChange={(e) => setBookingForm({...bookingForm, customerEmail: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Start Date:</label>
                    <input
                      type="date"
                      value={bookingForm.startDate}
                      onChange={(e) => setBookingForm({...bookingForm, startDate: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Number of Days:</label>
                    <input
                      type="number"
                      min="1"
                      value={bookingForm.numberOfDays}
                      onChange={(e) => setBookingForm({...bookingForm, numberOfDays: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={() => setShowBookingForm(false)}>
                      Cancel
                    </button>
                    <button type="button" className="btn-confirm" onClick={handleBookingSubmit}>
                      Confirm Booking
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CarListingPage;
