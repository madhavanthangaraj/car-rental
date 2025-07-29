package com.example.springbootfirst.repository;

import com.example.springbootfirst.models.RentalCar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RentalCarRepository extends JpaRepository<RentalCar, Long> {
}
