package com.insurance.claim_processing.config;

import com.insurance.claim_processing.filter.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth

                // Authentication endpoints
                .requestMatchers("/api/auth/**")
                .permitAll()

                // Admin dashboard - ADMIN only
                .requestMatchers("/api/admin/**")
                .hasRole("ADMIN")

                // Officer review - OFFICER only
                .requestMatchers(
                    HttpMethod.POST,
                    "/api/claims/*/review"
                )
                .hasRole("OFFICER")

                // Test endpoint
                .requestMatchers("/api/test/**")
                .authenticated()

                // Claims
                .requestMatchers("/api/claims/**")
                .hasAnyRole("CUSTOMER", "OFFICER", "ADMIN")

                // Policies
                .requestMatchers("/api/policies/**")
                .hasAnyRole("CUSTOMER", "OFFICER", "ADMIN")

                // Everything else requires authentication
                .anyRequest()
                .authenticated()
            )

            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}