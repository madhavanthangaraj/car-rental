package com.example.springbootfirst.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "car_likes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarLike {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "car_id", nullable = false)
    private Long carId;
    
    @Column(name = "like_count", nullable = false)
    private Integer likeCount = 0;
    
    public CarLike(Long carId) {
        this.carId = carId;
        this.likeCount = 0;
    }
}
