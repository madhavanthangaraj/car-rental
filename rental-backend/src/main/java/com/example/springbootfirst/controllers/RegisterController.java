package com.example.springbootfirst.controllers;

import com.example.springbootfirst.jwt.JwtTokenProvider;
import com.example.springbootfirst.models.LoginDetails;
import com.example.springbootfirst.models.UserDetailsDto;
import com.example.springbootfirst.services.RegisterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;
import java.util.HashMap;


import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class RegisterController {

    @Autowired
    private RegisterService registerService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserDetailsDto request) {
        String response = registerService.registerNewUser(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDetails request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUserName(),
                            request.getPassword()
                    )
            );

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(authentication);

            // Extract username and roles
            org.springframework.security.core.userdetails.User userDetails =
                    (org.springframework.security.core.userdetails.User) authentication.getPrincipal();

            String username = userDetails.getUsername();
            List<String> roles = userDetails.getAuthorities()
                    .stream()
                    .map(grantedAuthority -> grantedAuthority.getAuthority())
                    .toList();

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("username", username);
            response.put("roles", roles);
            response.put("token", token);


            return ResponseEntity.ok(response);

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Collections.singletonMap("error", "Invalid username or password"));
        }
    }

}
