package com.kalyan.RemoteWorkTracker.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Value("${allowed.origins:}")
    private String allowedOrigins;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(getAllowedOrigins())
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }

    private String[] getAllowedOrigins() {
        List<String> origins = new ArrayList<>();
        
        // Always allow localhost for development
        origins.add("http://localhost:3000");
        origins.add("http://localhost:3001");
        
        // Add production origins from environment variable
        if (allowedOrigins != null && !allowedOrigins.trim().isEmpty()) {
            String[] envOrigins = allowedOrigins.split(",");
            for (String origin : envOrigins) {
                String trimmed = origin.trim();
                if (!trimmed.isEmpty() && !origins.contains(trimmed)) {
                    origins.add(trimmed);
                }
            }
        }
        
        return origins.toArray(new String[0]);
    }
}
