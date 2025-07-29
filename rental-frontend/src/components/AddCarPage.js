import React, { useState } from 'react';
import '../styles/AddCarPage.css';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api';

const AddCarPage = () => {

  const navigate = useNavigate();
  const [form, setForm] = useState({
    brand: '',
    model: '',
    carType: '',
    fuelType: '',
    transmission: '',
    seatingCapacity: '',
    rentalPricePerDay: '',
    availabilityStatus: '',
    location: '',
    features: '',
    imageUrl: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Add the car
      const dataToSend = {
        ...form,
        features: form.features.split(',').map(f => f.trim()).filter(Boolean),
        seatingCapacity: parseInt(form.seatingCapacity, 10),
        rentalPricePerDay: parseFloat(form.rentalPricePerDay)
      };
      
      const res = await apiFetch('/rentalcars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Failed to add car');
      }

      // Navigate to car list after successful creation
      navigate('/car-listing');
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="add-car-form-container">
      <button type="button" className="back-btn" onClick={() => navigate('/home')}>Back</button>
      <h2>Add New Car</h2>
      <form className="add-car-form" onSubmit={handleSubmit}>

        <label>Brand:<input type="text" name="brand" value={form.brand} onChange={handleChange} required /></label><br/>
        <label>Model:<input type="text" name="model" value={form.model} onChange={handleChange} required /></label><br/>
        <label>Type:
  <select name="carType" value={form.carType} onChange={handleChange} required>
    <option value="">Select Type</option>
    <option value="suv">SUV</option>
    <option value="coupe">Coupe</option>
    <option value="van">Van</option>
    <option value="bus">Bus</option>
  </select>
</label><br/>
        <label>Fuel:
  <select name="fuelType" value={form.fuelType} onChange={handleChange} required>
    <option value="">Select Fuel</option>
    <option value="petrol">Petrol</option>
    <option value="diesel">Diesel</option>
    <option value="gas">Gas</option>
  </select>
</label><br/>
        <label>Transmission:
  <select name="transmission" value={form.transmission} onChange={handleChange} required>
    <option value="">Select Transmission</option>
    <option value="manual">Manual</option>
    <option value="automatic">Automatic</option>
  </select>
</label><br/>
        <label>Seats:<input name="seatingCapacity" type="number" value={form.seatingCapacity} onChange={handleChange} required min="1" /></label><br/>
        <label>Price/Day:<input name="rentalPricePerDay" type="number" value={form.rentalPricePerDay} onChange={handleChange} required min="0" step="0.01" /></label><br/>
        <label>Status:
  <select name="availabilityStatus" value={form.availabilityStatus} onChange={handleChange} required>
    <option value="">Select Status</option>
    <option value="available">Available</option>
    <option value="not available">Not Available</option>
  </select>
</label><br/>
        <label>Location:<input type="text" name="location" value={form.location} onChange={handleChange} required /></label><br/>
        <label>Features (comma separated):<input type="text" name="features" value={form.features} onChange={handleChange} /></label><br/>
        <label>Image URL:<input type="text" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Enter image URL" /></label><br/>

        <button type="submit" disabled={loading}>{loading ? 'Adding Car...' : 'Add Car'}</button>
        <button type="button" style={{marginLeft:'10px'}} onClick={()=>navigate('/home')}>Cancel</button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
    </>
  );
};

export default AddCarPage;
