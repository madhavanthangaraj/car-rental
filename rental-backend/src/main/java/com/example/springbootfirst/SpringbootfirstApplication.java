package com.example.springbootfirst;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

/**
 * 
 */
@SpringBootApplication
@EntityScan(basePackages = "com.example.springbootfirst.models")
public class SpringbootfirstApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpringbootfirstApplication.class, args);
	}

}