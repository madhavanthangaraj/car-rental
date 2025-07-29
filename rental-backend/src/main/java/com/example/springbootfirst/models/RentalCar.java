package com.example.springbootfirst.models;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "rental_item")
public class RentalCar {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long carId;

    private String brand;
    private String model;
    private String carType;
    private String fuelType;
    private String transmission;
    private Integer seatingCapacity;
    private BigDecimal rentalPricePerDay;
    private String availabilityStatus;
    private String location;
    private String imageUrl;

    @ElementCollection
    private List<String> features;

    public RentalCar() {}

    public RentalCar(Long carId, String brand, String model, String carType, String fuelType, String transmission, Integer seatingCapacity, BigDecimal rentalPricePerDay, String availabilityStatus, String location, String imageUrl, List<String> features) {
        this.carId = carId;
        this.brand = brand;
        this.model = model;
        this.carType = carType;
        this.fuelType = fuelType;
        this.transmission = transmission;
        this.seatingCapacity = seatingCapacity;
        this.rentalPricePerDay = rentalPricePerDay;
        this.availabilityStatus = availabilityStatus;
        this.location = location;
        this.imageUrl = imageUrl;
        this.features = features;
    }

    public Long getCarId() { return carId; }
    public void setCarId(Long carId) { this.carId = carId; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    public String getCarType() { return carType; }
    public void setCarType(String carType) { this.carType = carType; }
    public String getFuelType() { return fuelType; }
    public void setFuelType(String fuelType) { this.fuelType = fuelType; }
    public String getTransmission() { return transmission; }
    public void setTransmission(String transmission) { this.transmission = transmission; }
    public Integer getSeatingCapacity() { return seatingCapacity; }
    public void setSeatingCapacity(Integer seatingCapacity) { this.seatingCapacity = seatingCapacity; }
    public BigDecimal getRentalPricePerDay() { return rentalPricePerDay; }
    public void setRentalPricePerDay(BigDecimal rentalPricePerDay) { this.rentalPricePerDay = rentalPricePerDay; }
    public String getAvailabilityStatus() { return availabilityStatus; }
    public void setAvailabilityStatus(String availabilityStatus) { this.availabilityStatus = availabilityStatus; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public List<String> getFeatures() { return features; }
    public void setFeatures(List<String> features) { this.features = features; }
}
