package com.example.springbootfirst.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class JwtResponse {
    private String token;
    private String userName;
    private String roles;
}
