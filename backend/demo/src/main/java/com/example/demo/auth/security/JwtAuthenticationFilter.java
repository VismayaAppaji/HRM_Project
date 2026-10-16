package com.example.demo.auth.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.demo.auth.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserDetailsService userDetailsService) {

        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getServletPath();

        return "/".equals(path)
                || "/api/auth/login".equals(path)
                || "OPTIONS".equalsIgnoreCase(request.getMethod());
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String requestPath = request.getRequestURI();

        System.out.println(
                "===== JWT FILTER START ====="
        );

        System.out.println(
                "REQUEST = " + request.getMethod() + " " + requestPath
        );

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null) {

            System.out.println(
                    "JWT STATUS = Authorization header is NULL"
            );

            filterChain.doFilter(request, response);
            return;
        }

        if (!authHeader.startsWith("Bearer ")) {

            System.out.println(
                    "JWT STATUS = Authorization header is not Bearer"
            );

            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            System.out.println(
                    "JWT STATUS = Bearer token received"
            );

            /*
             * Step 1: Extract username
             */
            String username = jwtService.extractUsername(token);

            System.out.println(
                    "JWT USERNAME = " + username
            );

            /*
             * Step 2: Validate token
             */
            boolean validToken = jwtService.isTokenValid(token);

            System.out.println(
                    "JWT VALID = " + validToken
            );

            if (!validToken) {

                System.out.println(
                        "JWT STATUS = TOKEN INVALID OR EXPIRED"
                );

                SecurityContextHolder.clearContext();

                filterChain.doFilter(request, response);
                return;
            }

            /*
             * Step 3: Check whether authentication already exists
             */
            if (SecurityContextHolder.getContext()
                    .getAuthentication() != null) {

                System.out.println(
                        "JWT STATUS = Authentication already exists"
                );

                filterChain.doFilter(request, response);
                return;
            }

            /*
             * Step 4: Load user from database
             */
            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(username);

            System.out.println(
                    "SPRING USER = " + userDetails.getUsername()
            );

            System.out.println(
                    "SPRING AUTHORITIES = "
                            + userDetails.getAuthorities()
            );

            /*
             * Step 5: Create authentication
             */
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

            authentication.setDetails(
                    new WebAuthenticationDetailsSource()
                            .buildDetails(request)
            );

            /*
             * Step 6: Put authentication into SecurityContext
             */
            SecurityContextHolder.getContext()
                    .setAuthentication(authentication);

            System.out.println(
                    "AUTHENTICATION SUCCESS = "
                            + SecurityContextHolder.getContext()
                                    .getAuthentication()
                                    .getAuthorities()
            );

        } catch (Exception e) {

            System.out.println(
                    "===== JWT AUTHENTICATION ERROR ====="
            );

            System.out.println(
                    "ERROR TYPE = " + e.getClass().getName()
            );

            System.out.println(
                    "ERROR MESSAGE = " + e.getMessage()
            );

            e.printStackTrace();

            SecurityContextHolder.clearContext();
        }

        System.out.println(
                "===== JWT FILTER END ====="
        );

        filterChain.doFilter(request, response);
    }
}
