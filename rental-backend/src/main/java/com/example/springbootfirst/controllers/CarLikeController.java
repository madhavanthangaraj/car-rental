package com.example.springbootfirst.controllers;

import com.example.springbootfirst.services.CarLikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/car-likes")
@CrossOrigin(origins = "http://localhost:3000")
public class CarLikeController {
    
    @Autowired
    private CarLikeService carLikeService;
    
    /**
     * Increment like count for a specific car
     * @param carId The ID of the car to like
     * @return Updated like count and success status
     */
    @PostMapping("/increment/{carId}")
    public ResponseEntity<Map<String, Object>> incrementLike(@PathVariable Long carId) {
        try {
            Integer newCount = carLikeService.incrementLikeCount(carId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("carId", carId);
            response.put("likeCount", newCount);
            response.put("message", "Like count incremented successfully");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to increment like count: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Get like count for a specific car
     * @param carId The ID of the car
     * @return Like count for the car
     */
    @GetMapping("/count/{carId}")
    public ResponseEntity<Map<String, Object>> getLikeCount(@PathVariable Long carId) {
        try {
            Integer count = carLikeService.getLikeCount(carId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("carId", carId);
            response.put("likeCount", count);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to get like count: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Get like counts for multiple cars
     * @param carIds List of car IDs in request body
     * @return Map of car ID to like count
     */
    @PostMapping("/batch-counts")
    public ResponseEntity<Map<String, Object>> getBatchLikeCounts(@RequestBody Map<String, List<Long>> request) {
        try {
            List<Long> carIds = request.get("carIds");
            Map<Long, Integer> likeCounts = carLikeService.getLikeCounts(carIds);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("likeCounts", likeCounts);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to get batch like counts: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    /**
     * Get all like counts
     * @return Map of all car IDs to their like counts
     */
    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllLikeCounts() {
        try {
            Map<Long, Integer> likeCounts = carLikeService.getAllLikeCounts();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("likeCounts", likeCounts);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to get all like counts: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }
}
