package com.example.springbootfirst.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    public void sendBookingConfirmationEmail(String toEmail, Map<String, Object> bookingDetails) {
        try {
            logger.info("Attempting to send confirmation email to: {}", toEmail);
            
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Car Booking Confirmation - " + bookingDetails.get("carName"));
            message.setText(buildEmailContent(bookingDetails));
            message.setFrom(fromEmail); // Use email from application.properties
            
            logger.info("Email message prepared. Sending from {} to {}...", fromEmail, toEmail);
            mailSender.send(message);
            logger.info("Confirmation email sent successfully to: {}", toEmail);
            
        } catch (Exception e) {
            logger.error("Failed to send confirmation email to {}: {}", toEmail, e.getMessage(), e);
            throw new RuntimeException("Failed to send confirmation email: " + e.getMessage());
        }
    }
    
    private String buildEmailContent(Map<String, Object> bookingDetails) {
        StringBuilder content = new StringBuilder();
        
        content.append("Dear ").append(bookingDetails.get("customerName")).append(",\n\n");
        content.append("Thank you for your booking! Here are your booking details:\n\n");
        content.append("=== BOOKING CONFIRMATION ===\n");
        content.append("Car Name: ").append(bookingDetails.get("carName")).append("\n");
        content.append("Customer Name: ").append(bookingDetails.get("customerName")).append("\n");
        content.append("Email: ").append(bookingDetails.get("customerEmail")).append("\n");
        content.append("Start Date: ").append(bookingDetails.get("startDate")).append("\n");
        content.append("Number of Days: ").append(bookingDetails.get("numberOfDays")).append("\n");
        content.append("Per Day Cost: $").append(bookingDetails.get("perDayCost")).append("\n");
        content.append("Total Cost: $").append(bookingDetails.get("totalCost")).append("\n");
        content.append("Payment Status: CONFIRMED\n");
        content.append("Payment Date: ").append(bookingDetails.get("paymentDate")).append("\n\n");
        
        content.append("Important Information:\n");
        content.append("- Please arrive on time for your pickup\n");
        content.append("- Bring a valid driver's license and ID\n");
        content.append("- Contact us if you need to make any changes\n\n");
        
        content.append("Thank you for choosing our car rental service!\n\n");
        content.append("Best regards,\n");
        content.append("Car Rental Team\n");
        content.append("Phone: +1-234-567-8900\n");
        content.append("Email: support@carrentalsystem.com");
        
        return content.toString();
    }
}
