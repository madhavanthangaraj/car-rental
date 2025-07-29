package com.example.springbootfirst.repository;

import com.example.springbootfirst.models.CarLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface CarLikeRepository extends JpaRepository<CarLike, Long> {
    
    Optional<CarLike> findByCarId(Long carId);
    
    @Modifying
    @Transactional
    @Query("UPDATE CarLike cl SET cl.likeCount = cl.likeCount + 1 WHERE cl.carId = :carId")
    int incrementLikeCount(@Param("carId") Long carId);
    
    @Query("SELECT cl.likeCount FROM CarLike cl WHERE cl.carId = :carId")
    Optional<Integer> getLikeCountByCarId(@Param("carId") Long carId);
}
