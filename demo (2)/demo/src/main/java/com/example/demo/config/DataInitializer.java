package com.example.demo.config;

import java.util.UUID;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.demo.auth.entity.AppUser;
import com.example.demo.auth.repository.AppUserRepository;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeUsers(
            AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            if (!appUserRepository.existsByUsername("hradmin")) {

                AppUser hrUser = new AppUser();

                hrUser.setUsername("hradmin");
                hrUser.setPassword(
                        passwordEncoder.encode("admin123"));
                hrUser.setRole("HR");
                hrUser.setActive(true);

                appUserRepository.save(hrUser);
            }

            if (!appUserRepository.existsByUsername("employee001")) {

                AppUser employeeUser = new AppUser();

                employeeUser.setUsername("employee001");
                employeeUser.setPassword(
                        passwordEncoder.encode("employee123"));
                employeeUser.setRole("EMPLOYEE");
                employeeUser.setActive(true);

                employeeUser.setEmployeeId(
                        UUID.fromString(
                                "0583aeb1-763c-4aeb-aa3e-10add64a418b"));

                appUserRepository.save(employeeUser);
            }
        };
    }
}