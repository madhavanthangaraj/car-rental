package com.example.springbootfirst.services;

import com.example.springbootfirst.models.CarLike;
import com.example.springbootfirst.repository.CarLikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CarLikeService {
    
    @Autowired
    private CarLikeRepository carLikeRepository;
    
    /**
     * Increment like count for a specific car
     * @param carId The ID of the car to like
     * @return The updated like count
     */
    public Integer incrementLikeCount(Long carId) {
        // Check if car like record exists
        CarLike carLike = carLikeRepository.findByCarId(carId).orElse(null);
        
        if (carLike == null) {
            // Create new record if doesn't exist
            carLike = new CarLike(carId);
            carLike.setLikeCount(1);
            carLikeRepository.save(carLike);
            return 1;
        } else {
            // Increment existing count
            carLike.setLikeCount(carLike.getLikeCount() + 1);
            carLikeRepository.save(carLike);
            return carLike.getLikeCount();
        }
    }
    
    /**
     * Get like count for a specific car
     * @param carId The ID of the car
     * @return The like count (0 if no record exists)
     */
    public Integer getLikeCount(Long carId) {
        return carLikeRepository.getLikeCountByCarId(carId).orElse(0);
    }
    
    /**
     * Get like counts for multiple cars
     * @param carIds List of car IDs
     * @return Map of car ID to like count
     */
    public Map<Long, Integer> getLikeCounts(List<Long> carIds) {
        Map<Long, Integer> likeCounts = new HashMap<>();
        
        for (Long carId : carIds) {
            Integer count = getLikeCount(carId);
            likeCounts.put(carId, count);
        }
        
        return likeCounts;
    }
    
    /**
     * Get all like counts
     * @return Map of car ID to like count for all cars that have likes
     */
    public Map<Long, Integer> getAllLikeCounts() {
        List<CarLike> allLikes = carLikeRepository.findAll();
        Map<Long, Integer> likeCounts = new HashMap<>();
        
        for (CarLike carLike : allLikes) {
            likeCounts.put(carLike.getCarId(), carLike.getLikeCount());
        }
        
        return likeCounts;
    }
}
