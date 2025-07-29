package com.example.springbootfirst.services;

import com.example.springbootfirst.models.RentalCar;
import com.example.springbootfirst.repository.RentalCarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RentalCarService {
    @Autowired
    private RentalCarRepository rentalCarRepository;

    public RentalCar saveRentalCar(RentalCar rentalCar) {
        return rentalCarRepository.save(rentalCar);
    }

    public RentalCar updateRentalCar(Long carId, RentalCar rentalCar) {
        rentalCar.setCarId(carId);
        return rentalCarRepository.save(rentalCar);
    }

    public List<RentalCar> getAllRentalCars() {
        return rentalCarRepository.findAll();
    }

    public Optional<RentalCar> getRentalCarById(Long carId) {
        return rentalCarRepository.findById(carId);
    }

    public void deleteRentalCar(Long carId) {
        rentalCarRepository.deleteById(carId);
    }
}
