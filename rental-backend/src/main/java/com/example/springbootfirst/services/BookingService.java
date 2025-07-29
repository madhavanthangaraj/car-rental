package com.example.springbootfirst.services;

import com.example.springbootfirst.models.Booking;
import com.example.springbootfirst.models.RentalCar;
import com.example.springbootfirst.repository.BookingRepository;
import com.example.springbootfirst.repository.RentalCarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private RentalCarRepository rentalCarRepository;
    
    public boolean isCarAvailable(Long carId, LocalDate startDate, LocalDate endDate) {
        // Check if car exists and is available
        Optional<RentalCar> carOpt = rentalCarRepository.findById(carId);
        if (carOpt.isEmpty()) {
            return false;
        }
        
        RentalCar car = carOpt.get();
        if (!"Available".equalsIgnoreCase(car.getAvailabilityStatus())) {
            return false;
        }
        
        // Check for conflicting bookings
        List<Booking> conflictingBookings = bookingRepository.findActiveBookingsForCarInDateRange(
            carId, startDate, endDate);
        
        return conflictingBookings.isEmpty();
    }
    
    public Booking createBooking(Long carId, String customerName, String customerEmail, 
                               LocalDate startDate, Integer numberOfDays) {
        LocalDate endDate = startDate.plusDays(numberOfDays - 1);
        
        // Check availability
        if (!isCarAvailable(carId, startDate, endDate)) {
            throw new RuntimeException("Car is not available for the selected dates");
        }
        
        // Create booking
        Booking booking = new Booking(carId, customerName, customerEmail, startDate, endDate, numberOfDays);
        Booking savedBooking = bookingRepository.save(booking);
        
        // Update car status to not available
        Optional<RentalCar> carOpt = rentalCarRepository.findById(carId);
        if (carOpt.isPresent()) {
            RentalCar car = carOpt.get();
            car.setAvailabilityStatus("Not Available");
            rentalCarRepository.save(car);
        }
        
        return savedBooking;
    }
    
    public void updateExpiredBookings() {
        LocalDate currentDate = LocalDate.now();
        List<RentalCar> allCars = rentalCarRepository.findAll();
        
        for (RentalCar car : allCars) {
            List<Booking> expiredBookings = bookingRepository.findExpiredBookingsForCar(
                car.getCarId(), currentDate);
            
            if (!expiredBookings.isEmpty()) {
                // Mark expired bookings as completed
                for (Booking booking : expiredBookings) {
                    booking.setStatus("COMPLETED");
                    bookingRepository.save(booking);
                }
                
                // Check if car should be available again
                List<Booking> activeBookings = bookingRepository.findActiveBookingsForCarInDateRange(
                    car.getCarId(), currentDate, currentDate.plusYears(1));
                
                if (activeBookings.isEmpty()) {
                    car.setAvailabilityStatus("Available");
                    rentalCarRepository.save(car);
                }
            }
        }
    }
    
    public List<Booking> getBookingsForCar(Long carId) {
        return bookingRepository.findByCarId(carId);
    }
    
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    public Optional<Booking> getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId);
    }
}
