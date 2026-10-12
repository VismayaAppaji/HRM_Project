package com.example.demo.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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

    @Bean
    public AuthenticationProvider authenticationProvider(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder);

        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

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

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            AuthenticationProvider authenticationProvider)
            throws Exception {

        http

            // Disable CSRF because this is a stateless REST API
            .csrf(csrf -> csrf.disable())

            // Enable CORS
            .cors(cors ->
                    cors.configurationSource(
                            corsConfigurationSource()
                    )
            )

            // JWT based authentication
            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )

            // Authentication provider
            .authenticationProvider(
                    authenticationProvider
            )

            // Authorization rules
            .authorizeHttpRequests(auth -> auth

                    // =========================
                    // AUTHENTICATION
                    // =========================

                    // Login does not require JWT
                    .requestMatchers(
                            "/api/auth/login"
                    ).permitAll()


                    // =========================
                    // EMPLOYEES
                    // =========================

                    // HR and Employee can access their own profile
                    .requestMatchers(
                            "/api/employees/me"
                    ).hasAnyRole("HR", "EMPLOYEE")

                    // Other employee APIs are HR only
                    .requestMatchers(
                            "/api/employees/**"
                    ).hasRole("HR")


                    // =========================
                    // SALARY
                    // =========================

                    // Salary structure - HR only
                    .requestMatchers(
                            "/api/salary-structures/**"
                    ).hasRole("HR")

                    // Employee salary - HR only
                    .requestMatchers(
                            "/api/employee-salaries/**"
                    ).hasRole("HR")


                    // =========================
                    // PAYROLL
                    // =========================

                    // Employee can access their own payroll
                    .requestMatchers(
                            "/api/payrolls/me"
                    ).hasRole("EMPLOYEE")

                    // Other payroll APIs are HR only
                    .requestMatchers(
                            "/api/payrolls/**"
                    ).hasRole("HR")


                    // =========================
                    // LEAVE BALANCE
                    // =========================

                    // HR and Employee can access their
                    // own leave balance endpoint
                    .requestMatchers(
                            "/api/leave-balances/me"
                    ).hasAnyRole("HR", "EMPLOYEE")

                    // Employee-specific leave balance endpoints
                    // are HR only
                    .requestMatchers(
                            "/api/leave-balances/**"
                    ).hasRole("HR")


                    // =========================
                    // DASHBOARD
                    // =========================

                    // Dashboard - HR only
                    .requestMatchers(
                            "/api/dashboard/**"
                    ).hasRole("HR")


                    // =========================
                    // EMAIL
                    // =========================

                    // Email logs - HR only
                    .requestMatchers(
                            "/api/email-logs/**"
                    ).hasRole("HR")

                    // Email APIs - HR only
                    .requestMatchers(
                            "/api/emails/**"
                    ).hasRole("HR")


                    // =========================
                    // LEAVE APPLICATIONS
                    // =========================

                    // Leave applications currently accessible
                    // by both HR and Employee
                    .requestMatchers(
                            "/api/leave-applications/**"
                    ).hasAnyRole("HR", "EMPLOYEE")


                    // =========================
                    // PAYSLIPS
                    // =========================

                    // HR and Employee can access payslip endpoint.
                    // Ownership is checked inside PayslipServiceImpl
                    .requestMatchers(
                            "/api/payslips/**"
                    ).hasAnyRole("HR", "EMPLOYEE")


                    // =========================
                    // DEFAULT
                    // =========================

                    // Everything else requires authentication
                    .anyRequest().authenticated()
            )

            // JWT filter must execute before
            // username/password authentication
            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}