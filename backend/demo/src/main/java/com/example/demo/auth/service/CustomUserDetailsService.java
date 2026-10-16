package com.example.demo.auth.service;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.auth.entity.AppUser;
import com.example.demo.auth.repository.AppUserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AppUserRepository appUserRepository;

    public CustomUserDetailsService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        AppUser appUser = appUserRepository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "User not found: " + username));

        if (!Boolean.TRUE.equals(appUser.getActive())) {
            throw new UsernameNotFoundException(
                    "User account is inactive: " + username);
        }

        // Temporary debugging information
        System.out.println(
                "LOGIN USER = " + appUser.getUsername()
                + " | ROLE = " + appUser.getRole()
                + " | ACTIVE = " + appUser.getActive()
        );

        return User.builder()
                .username(appUser.getUsername())
                .password(appUser.getPassword())
                .roles(appUser.getRole())
                .build();
    }
}
