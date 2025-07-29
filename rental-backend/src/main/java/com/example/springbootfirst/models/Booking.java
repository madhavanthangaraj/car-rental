package com.example.springbootfirst.models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;
    
    private Long carId;
    private String customerName;
    private String customerEmail;
    private LocalDate bookingDate;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer numberOfDays;
    private String status; // "ACTIVE", "COMPLETED", "CANCELLED"
    
    public Booking() {}
    
    public Booking(Long carId, String customerName, String customerEmail, 
                   LocalDate startDate, LocalDate endDate, Integer numberOfDays) {
        this.carId = carId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.bookingDate = LocalDate.now();
        this.startDate = startDate;
        this.endDate = endDate;
        this.numberOfDays = numberOfDays;
        this.status = "ACTIVE";
    }
    
    // Getters and Setters
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
    
    public Long getCarId() { return carId; }
    public void setCarId(Long carId) { this.carId = carId; }
    
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    
    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }
    
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    
    public Integer getNumberOfDays() { return numberOfDays; }
    public void setNumberOfDays(Integer numberOfDays) { this.numberOfDays = numberOfDays; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
