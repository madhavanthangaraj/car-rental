package com.example.springbootfirst.services;

import com.example.springbootfirst.models.RegisterDetails;
import com.example.springbootfirst.repository.RegisterDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private RegisterDetailsRepository registerDetailsRepository;

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        RegisterDetails user = registerDetailsRepository.findByUserName(userName)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userName));

        Set<SimpleGrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toSet());

        return new org.springframework.security.core.userdetails.User(
                user.getUserName(),
                user.getPassword(),
                authorities
        );
    }
}