import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { apiFetch } from '../api';
import { buildApiUrl } from '../config/api';
import '../styles/CarListingPage.css';

import { FaEye, FaEdit, FaTrash, FaCarSide } from 'react-icons/fa';

const CarListingPage = () => {
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [editCarId, setEditCarId] = useState(null);
  const [editForm, setEditForm] = useState({ brand: '', model: '', carType: '', fuelType: '', transmission: '', seatingCapacity: '', rentalPricePerDay: '', availabilityStatus: '', location: '', features: '', imageUrl: '' });

  const startEdit = (car) => {
    setEditCarId(car.carId);
    setEditForm({
      brand: car.brand || '',
      model: car.model || '',
      carType: car.carType || '',
      fuelType: car.fuelType || '',
      transmission: car.transmission || '',
      seatingCapacity: car.seatingCapacity || '',
      rentalPricePerDay: car.rentalPricePerDay || '',
      availabilityStatus: car.availabilityStatus || '',
      location: car.location || '',
      features: car.features ? car.features.join(', ') : '',
      imageUrl: car.imageUrl || ''
    });
  };

  const cancelEdit = () => {
    setEditCarId(null);
    setEditForm({ brand: '', model: '', carType: '', fuelType: '', transmission: '', seatingCapacity: '', rentalPricePerDay: '', availabilityStatus: '', location: '', features: '', imageUrl: '' });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async (carId) => {
    try {
      const token = localStorage.getItem('token');
      const dataToSend = {
        ...editForm,
        features: editForm.features.split(',').map(f => f.trim()).filter(Boolean),
        seatingCapacity: parseInt(editForm.seatingCapacity, 10),
        rentalPricePerDay: parseFloat(editForm.rentalPricePerDay)
      };
      const res = await apiFetch(buildApiUrl(`/rentalcars/${carId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify(dataToSend)
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to update car');
      }
      setCars(prev => prev.map(car => car.carId === carId ? { ...car, ...dataToSend } : car));
      setEditCarId(null);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch(buildApiUrl(`/rentalcars/${carId}`), {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to delete car');
      }
      setCars(prev => prev.filter(car => car.carId !== carId));
      if (selectedCar && selectedCar.carId === carId) setSelectedCar(null);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoggedIn(false);
      setError(null);
      setLoading(false);
      return;
    }
    setIsLoggedIn(true);
    setLoading(true);
    apiFetch(buildApiUrl('/rentalcars'), {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(text => {
            throw new Error(`Failed to fetch cars. Status: ${response.status}. Body: ${text}`);
          });
        }
        return response.json();
      })
      .then(data => {
        setCars(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="car-listing-container">
      {/* <Header /> */}
      <div className="car-listing-header">
        
        <h1>
          <FaCarSide style={{marginRight: '12px', color: '#667eea'}} />
          Rental Car Listing
        </h1>
        <p>Manage and view all available rental cars</p>
      </div>
      
      <button type="button" className="car-listing-btn car-listing-back-btn" onClick={() => navigate('/home')} style={{marginBottom: '20px'}}>
        Back
      </button>

      {!isLoggedIn ? (
        <div className="login-prompt">
          <p>Please log in to view car listings.</p>
        </div>
      ) : loading ? (
        <div className="loading-container">
          <p>Loading cars...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p>Error: {error}</p>
        </div>
      ) : (
        <div className="cars-grid">
          {cars.map(car => (
            <div key={car.carId} className="car-card">
              <div className="car-image-container">
                {car.imageUrl ? (
                  <img 
                    src={car.imageUrl} 
                    alt={`${car.brand} ${car.model}`}
                    className="car-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="car-image" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    color: '#666'
                  }}>
                    <FaCarSide size={48} />
                  </div>
                )}
              </div>
              
              <div className="car-content">
                <div className="car-header">
                  <h3 className="car-title">{car.brand} {car.model}</h3>
                  <span className="car-type">{car.carType}</span>
                </div>
                
                <div className="car-details">
                  <div className="car-detail"><strong>ID:</strong> {car.carId}</div>
                  <div className="car-detail"><strong>Fuel:</strong> {car.fuelType}</div>
                  <div className="car-detail"><strong>Transmission:</strong> {car.transmission}</div>
                  <div className="car-detail"><strong>Seats:</strong> {car.seatingCapacity}</div>
                  <div className="car-detail"><strong>Location:</strong> {car.location}</div>
                  <div className="car-detail"><strong>Features:</strong> {car.features && car.features.join(', ')}</div>
                </div>
                
                <div className="car-price">
                  <div>
                    <span className="price-amount">${car.rentalPricePerDay}</span>
                    <span className="price-period">/day</span>
                  </div>
                  <span className={`availability-status ${car.availabilityStatus?.toLowerCase() === 'available' ? 'status-available' : 'status-not-available'}`}>
                    {car.availabilityStatus}
                  </span>
                </div>

                <div className="car-actions">
                  <button 
                    className="car-listing-btn car-listing-view-btn" 
                    title="View Details" 
                    onClick={() => setSelectedCar(car)}
                  >
                    <FaEye />
                    View
                  </button>
                  <button 
                    className="car-listing-btn car-listing-edit-btn" 
                    title="Edit Car" 
                    onClick={() => startEdit(car)}
                  >
                    <FaEdit />
                    Edit
                  </button>
                  <button 
                    className="car-listing-btn car-listing-delete-btn" 
                    title="Delete Car" 
                    onClick={() => handleDelete(car.carId)}
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Car Details Modal */}
      {selectedCar && !editCarId && (
        <div className="modal-overlay" onClick={() => setSelectedCar(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Car Details</h2>
              <button className="car-listing-btn car-listing-close-btn" onClick={() => setSelectedCar(null)}>×</button>
            </div>
            <div className="car-details">
              <div className="car-detail"><strong>ID:</strong> {selectedCar.carId}</div>
              <div className="car-detail"><strong>Brand:</strong> {selectedCar.brand}</div>
              <div className="car-detail"><strong>Model:</strong> {selectedCar.model}</div>
              <div className="car-detail"><strong>Type:</strong> {selectedCar.carType}</div>
              <div className="car-detail"><strong>Fuel:</strong> {selectedCar.fuelType}</div>
              <div className="car-detail"><strong>Transmission:</strong> {selectedCar.transmission}</div>
              <div className="car-detail"><strong>Seats:</strong> {selectedCar.seatingCapacity}</div>
              <div className="car-detail"><strong>Price/Day:</strong> ${selectedCar.rentalPricePerDay}</div>
              <div className="car-detail"><strong>Status:</strong> {selectedCar.availabilityStatus}</div>
              <div className="car-detail"><strong>Location:</strong> {selectedCar.location}</div>
              <div className="car-detail"><strong>Features:</strong> {selectedCar.features && selectedCar.features.join(', ')}</div>
            </div>
            {selectedCar.imageUrl && (
              <div style={{marginTop: '20px', textAlign: 'center'}}>
                <img 
                  src={selectedCar.imageUrl} 
                  alt="Car" 
                  style={{maxWidth: '100%', maxHeight: '300px', borderRadius: '8px'}} 
                />
              </div>
            )}
            <div className="form-actions">
              <button className="car-listing-btn car-listing-secondary-btn" onClick={() => setSelectedCar(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Car Modal */}
      {editCarId && (
        <div className="modal-overlay" onClick={cancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Car</h2>
              <button className="car-listing-btn car-listing-close-btn" onClick={cancelEdit}>×</button>
            </div>
            <div className="form-group">
              <label className="form-label">Brand</label>
              <input 
                name="brand" 
                value={editForm.brand} 
                onChange={handleEditChange} 
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Model</label>
              <input 
                name="model" 
                value={editForm.model} 
                onChange={handleEditChange} 
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Car Type</label>
              <input 
                name="carType" 
                value={editForm.carType} 
                onChange={handleEditChange} 
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Fuel Type</label>
              <input 
                name="fuelType" 
                value={editForm.fuelType} 
                onChange={handleEditChange} 
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Transmission</label>
              <input 
                name="transmission" 
                value={editForm.transmission} 
                onChange={handleEditChange} 
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Seating Capacity</label>
              <input 
                name="seatingCapacity" 
                value={editForm.seatingCapacity} 
                onChange={handleEditChange} 
                type="number" 
                min="1" 
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Rental Price Per Day</label>
              <input 
                name="rentalPricePerDay" 
                value={editForm.rentalPricePerDay} 
                onChange={handleEditChange} 
                type="number" 
                min="0" 
                step="0.01" 
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Availability Status</label>
              <input 
                name="availabilityStatus" 
                value={editForm.availabilityStatus} 
                onChange={handleEditChange} 
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input 
                name="location" 
                value={editForm.location} 
                onChange={handleEditChange} 
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Features</label>
              <input 
                name="features" 
                value={editForm.features} 
                onChange={handleEditChange} 
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input 
                name="imageUrl" 
                value={editForm.imageUrl} 
                onChange={handleEditChange} 
                className="form-input"
              />
            </div>
            {editForm.imageUrl && (
              <div style={{marginTop: '20px', textAlign: 'center'}}>
                <img 
                  src={editForm.imageUrl} 
                  alt="Car Preview" 
                  style={{maxWidth: '100%', maxHeight: '200px', borderRadius: '8px'}} 
                />
              </div>
            )}
            <div className="form-actions">
              <button className="car-listing-btn car-listing-primary-btn" onClick={() => handleEditSave(editCarId)}>
                Save Changes
              </button>
              <button className="car-listing-btn car-listing-secondary-btn" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

};

export default CarListingPage;
