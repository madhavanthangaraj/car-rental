package com.example.springbootfirst.controllers;

import com.example.springbootfirst.models.RentalCar;
import com.example.springbootfirst.services.RentalCarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.Collections;

@RestController
@RequestMapping("/rentalcars")
public class RentalCarController {
    @Autowired
    private RentalCarService rentalCarService;

    @PostMapping
    public ResponseEntity<RentalCar> createRentalCar(@RequestBody RentalCar rentalCar) {
        RentalCar savedCar = rentalCarService.saveRentalCar(rentalCar);
        return ResponseEntity.ok(savedCar);
    }

    @PutMapping("/{carId}")
    public ResponseEntity<RentalCar> updateRentalCar(@PathVariable Long carId, @RequestBody RentalCar rentalCar) {
        RentalCar updated = rentalCarService.updateRentalCar(carId, rentalCar);
        return ResponseEntity.ok(updated);
    }

    @GetMapping
    public ResponseEntity<List<RentalCar>> getAllRentalCars() {
        return ResponseEntity.ok(rentalCarService.getAllRentalCars());
    }

    @GetMapping("/{carId}")
    public ResponseEntity<RentalCar> getRentalCarById(@PathVariable Long carId) {
        Optional<RentalCar> rentalCar = rentalCarService.getRentalCarById(carId);
        return rentalCar.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{carId}")
    public ResponseEntity<?> deleteRentalCar(@PathVariable Long carId) {
        rentalCarService.deleteRentalCar(carId);
        return ResponseEntity.ok(Collections.singletonMap("message", "Deleted successfully"));
    }
}
