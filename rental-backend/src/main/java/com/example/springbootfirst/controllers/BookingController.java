package com.example.springbootfirst.controllers;

import com.example.springbootfirst.models.Booking;
import com.example.springbootfirst.services.BookingService;
import com.example.springbootfirst.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
public class BookingController {
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private EmailService emailService;
    
    @GetMapping("/check-availability/{carId}")
    public ResponseEntity<Map<String, Object>> checkAvailability(
            @PathVariable Long carId,
            @RequestParam String startDate,
            @RequestParam int numberOfDays) {
        
        try {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = start.plusDays(numberOfDays - 1);
            
            boolean available = bookingService.isCarAvailable(carId, start, end);
            
            Map<String, Object> response = new HashMap<>();
            response.put("available", available);
            response.put("carId", carId);
            response.put("startDate", startDate);
            response.put("numberOfDays", numberOfDays);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createBooking(@RequestBody Map<String, Object> bookingRequest) {
        try {
            Long carId = Long.valueOf(bookingRequest.get("carId").toString());
            String customerName = bookingRequest.get("customerName").toString();
            String customerEmail = bookingRequest.get("customerEmail").toString();
            LocalDate startDate = LocalDate.parse(bookingRequest.get("startDate").toString());
            Integer numberOfDays = Integer.valueOf(bookingRequest.get("numberOfDays").toString());
            
            Booking booking = bookingService.createBooking(carId, customerName, customerEmail, startDate, numberOfDays);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("booking", booking);
            response.put("message", "Booking created successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/car/{carId}")
    public ResponseEntity<List<Booking>> getBookingsForCar(@PathVariable Long carId) {
        List<Booking> bookings = bookingService.getBookingsForCar(carId);
        return ResponseEntity.ok(bookings);
    }
    
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }
    
    @PostMapping("/update-expired")
    public ResponseEntity<Map<String, String>> updateExpiredBookings() {
        try {
            bookingService.updateExpiredBookings();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Expired bookings updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @PostMapping("/send-confirmation-email")
    public ResponseEntity<Map<String, Object>> sendConfirmationEmail(@RequestBody Map<String, Object> emailRequest) {
        try {
            String customerEmail = emailRequest.get("customerEmail").toString();
            
            // Extract booking details from the request
            Map<String, Object> bookingDetails = new HashMap<>();
            bookingDetails.put("carName", emailRequest.get("carName"));
            bookingDetails.put("customerName", emailRequest.get("customerName"));
            bookingDetails.put("customerEmail", customerEmail);
            bookingDetails.put("startDate", emailRequest.get("startDate"));
            bookingDetails.put("numberOfDays", emailRequest.get("numberOfDays"));
            bookingDetails.put("perDayCost", emailRequest.get("perDayCost"));
            bookingDetails.put("totalCost", emailRequest.get("totalCost"));
            bookingDetails.put("paymentDate", emailRequest.get("paymentDate"));
            
            emailService.sendBookingConfirmationEmail(customerEmail, bookingDetails);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Confirmation email sent successfully to " + customerEmail);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Failed to send confirmation email: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @PostMapping("/test-email")
    public ResponseEntity<Map<String, Object>> testEmail(@RequestBody Map<String, String> request) {
        try {
            String testEmail = request.get("email");
            
            Map<String, Object> testBookingDetails = new HashMap<>();
            testBookingDetails.put("carName", "Test Car");
            testBookingDetails.put("customerName", "Test Customer");
            testBookingDetails.put("customerEmail", testEmail);
            testBookingDetails.put("startDate", "2024-01-01");
            testBookingDetails.put("numberOfDays", "3");
            testBookingDetails.put("perDayCost", "50.00");
            testBookingDetails.put("totalCost", "150.00");
            testBookingDetails.put("paymentDate", "2024-01-01");
            
            emailService.sendBookingConfirmationEmail(testEmail, testBookingDetails);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Test email sent successfully to " + testEmail);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "Test email failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
