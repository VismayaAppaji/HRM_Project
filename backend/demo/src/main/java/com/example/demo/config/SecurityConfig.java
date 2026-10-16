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

    // =========================================================
    // AUTHENTICATION PROVIDER
    // =========================================================

    @Bean
    public AuthenticationProvider authenticationProvider(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {

        DaoAuthenticationProvider provider =
                new DaoAuthenticationProvider(userDetailsService);

        provider.setPasswordEncoder(passwordEncoder);

        return provider;
    }

    // =========================================================
    // AUTHENTICATION MANAGER
    // =========================================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

    // =========================================================
    // CORS CONFIGURATION
    // =========================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173",
                        "https://hrm-project-2-abgh.onrender.com"
                )
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

    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            AuthenticationProvider authenticationProvider)
            throws Exception {

        http

            // -------------------------------------------------
            // CSRF
            // -------------------------------------------------
            .csrf(csrf -> csrf.disable())

            // -------------------------------------------------
            // CORS
            // -------------------------------------------------
            .cors(cors ->
                    cors.configurationSource(
                            corsConfigurationSource()
                    )
            )

            // -------------------------------------------------
            // STATELESS SESSION
            // -------------------------------------------------
            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )

            // -------------------------------------------------
            // AUTHENTICATION PROVIDER
            // -------------------------------------------------
            .authenticationProvider(
                    authenticationProvider
            )

            // -------------------------------------------------
            // AUTHORIZATION
            // -------------------------------------------------
            .authorizeHttpRequests(auth -> auth

                    // =================================================
                    // ROOT
                    // =================================================

                    .requestMatchers("/")
                    .permitAll()

                    // =================================================
                    // OPTIONS / CORS PREFLIGHT
                    // =================================================

                    .requestMatchers(
                            HttpMethod.OPTIONS,
                            "/**"
                    )
                    .permitAll()

                    // =================================================
                    // AUTHENTICATION
                    // =================================================

                    .requestMatchers(
                            "/api/auth/login"
                    )
                    .permitAll()

                    // =================================================
                    // EMPLOYEES
                    // =================================================

                    // HR + Employee can view their own profile
                    .requestMatchers(
                            "/api/employees/me"
                    )
                    .hasAnyRole(
                            "HR",
                            "EMPLOYEE"
                    )

                    // Only HR can manage employees
                    .requestMatchers(
                            "/api/employees/**"
                    )
                    .hasRole("HR")

                    // =================================================
                    // SALARY STRUCTURE
                    // =================================================

                    .requestMatchers(
                            "/api/salary-structures/**"
                    )
                    .hasRole("HR")

                    // =================================================
                    // EMPLOYEE SALARY
                    // =================================================

                    .requestMatchers(
                            "/api/employee-salaries/**"
                    )
                    .hasRole("HR")

                    // =================================================
                    // PAYROLL
                    // =================================================

                    // Employee can view own payroll
                    .requestMatchers(
                            "/api/payrolls/me"
                    )
                    .hasRole("EMPLOYEE")

                    // HR can manage payroll
                    .requestMatchers(
                            "/api/payrolls/**"
                    )
                    .hasRole("HR")

                    // =================================================
                    // LEAVE BALANCE
                    // =================================================

                    // Employee + HR can view own balance
                    .requestMatchers(
                            "/api/leave-balances/me"
                    )
                    .hasAnyRole(
                            "HR",
                            "EMPLOYEE"
                    )

                    // HR can manage leave balances
                    .requestMatchers(
                            "/api/leave-balances/**"
                    )
                    .hasRole("HR")

                    // =================================================
                    // HR DASHBOARD
                    // =================================================

                    // Only HR can access HR dashboard APIs
                    .requestMatchers(
                            "/api/dashboard/**"
                    )
                    .hasRole("HR")

                    // =================================================
                    // EMAIL LOGS
                    // =================================================

                    .requestMatchers(
                            "/api/email-logs/**"
                    )
                    .hasRole("HR")

                    // =================================================
                    // EMAILS
                    // =================================================

                    .requestMatchers(
                            "/api/emails/**"
                    )
                    .hasRole("HR")

                    // =================================================
                    // LEAVE APPLICATIONS
                    // =================================================

                    // Both HR and Employee
                    .requestMatchers(
                            "/api/leave-applications/**"
                    )
                    .hasAnyRole(
                            "HR",
                            "EMPLOYEE"
                    )

                    // =================================================
                    // PAYSLIPS
                    // =================================================

                    // Both HR and Employee
                    .requestMatchers(
                            "/api/payslips/**"
                    )
                    .hasAnyRole(
                            "HR",
                            "EMPLOYEE"
                    )

                    // =================================================
                    // EVERYTHING ELSE
                    // =================================================

                    .anyRequest()
                    .authenticated()
            )

            // =================================================
            // JWT FILTER
            // =================================================

            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}
