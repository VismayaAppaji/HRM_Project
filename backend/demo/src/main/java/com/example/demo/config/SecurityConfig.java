package com.example.demo.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.demo.auth.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    // =========================
    // AUTHENTICATION PROVIDER
    // =========================

    @Bean
    public AuthenticationProvider authenticationProvider(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder);

        return provider;
    }

    // =========================
    // AUTHENTICATION MANAGER
    // =========================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

    // =========================
    // CORS CONFIGURATION
    // =========================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        // Allow local frontend + deployed Render frontend
        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173",
                        "https://hrm-project-2-abgh.onrender.com"
                )
        );

        // Allowed HTTP methods
        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );

        // Allow request headers
        configuration.setAllowedHeaders(
                List.of("*")
        );

        // Allow cookies/credentials if required
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    // =========================
    // SECURITY FILTER CHAIN
    // =========================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            AuthenticationProvider authenticationProvider)
            throws Exception {

        http

            // Disable CSRF for REST API
            .csrf(csrf -> csrf.disable())

            // Enable CORS
            .cors(cors ->
                    cors.configurationSource(
                            corsConfigurationSource()
                    )
            )

            // JWT = stateless
            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )

            // Authentication provider
            .authenticationProvider(
                    authenticationProvider
            )

            // =========================
            // AUTHORIZATION RULES
            // =========================

            .authorizeHttpRequests(auth -> auth

                    // =========================
                    // ROOT
                    // =========================

                    .requestMatchers("/")
                    .permitAll()

                    // =========================
                    // CORS PREFLIGHT
                    // =========================

                    .requestMatchers(
                            HttpMethod.OPTIONS,
                            "/**"
                    )
                    .permitAll()

                    // =========================
                    // LOGIN
                    // =========================

                    .requestMatchers(
                            "/api/auth/login"
                    )
                    .permitAll()

                    // =========================
                    // EMPLOYEES
                    // =========================

                    // Employee can access their own profile
                    .requestMatchers(
                            "/api/employees/me"
                    )
                    .hasAnyRole(
                            "HR",
                            "EMPLOYEE"
                    )

                    // Only HR can access employee management APIs
                    .requestMatchers(
                            "/api/employees/**"
                    )
                    .hasRole("HR")

                    // =========================
                    // SALARY
                    // =========================

                    .requestMatchers(
                            "/api/salary-structures/**"
                    )
                    .hasRole("HR")

                    .requestMatchers(
                            "/api/employee-salaries/**"
                    )
                    .hasRole("HR")

                    // =========================
                    // PAYROLL
                    // =========================

                    // Employee can access their own payroll
                    .requestMatchers(
                            "/api/payrolls/me"
                    )
                    .hasRole("
