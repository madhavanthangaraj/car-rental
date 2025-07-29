package com.example.springbootfirst.repository;

import com.example.springbootfirst.models.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByCarId(Long carId);
    
    @Query("SELECT b FROM Booking b WHERE b.carId = :carId AND b.status = 'ACTIVE' AND " +
           "(b.startDate <= :endDate AND b.endDate >= :startDate)")
    List<Booking> findActiveBookingsForCarInDateRange(@Param("carId") Long carId, 
                                                     @Param("startDate") LocalDate startDate, 
                                                     @Param("endDate") LocalDate endDate);
    
    @Query("SELECT b FROM Booking b WHERE b.carId = :carId AND b.status = 'ACTIVE' AND b.endDate < :currentDate")
    List<Booking> findExpiredBookingsForCar(@Param("carId") Long carId, @Param("currentDate") LocalDate currentDate);
}
