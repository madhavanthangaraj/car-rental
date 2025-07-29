package com.example.springbootfirst.repository;

import com.example.springbootfirst.models.RegisterDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegisterDetailsRepository extends JpaRepository<RegisterDetails,Integer> {
    Optional<RegisterDetails> findByUserName(String userName);
}
