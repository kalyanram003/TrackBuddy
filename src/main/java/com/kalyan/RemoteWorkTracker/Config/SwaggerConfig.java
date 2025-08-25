package com.kalyan.RemoteWorkTracker.Config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI remoteWorkTrackerOpenAPI() {
        return new OpenAPI()
                .addSecurityItem(new SecurityRequirement().addList("Bearer Auth"))
                .components(new Components()
                    .addSecuritySchemes("Bearer Auth", 
                            new SecurityScheme()
                                .name("Authorization")
                                .type(SecurityScheme.Type.HTTP)
                                
                                .scheme("bearer")
                                .bearerFormat("JWT")
                        ))

                .info(new Info()
                        .title("Remote Work Tracker API")
                        .description("API documentation for Remote Work Tracker project")
                        .version("v1.0")
                        .contact(new Contact()
                                .name("Kalyan")
                                
                                .email("kalyanram2053@gmail.com")
                                .url("https://github.com/kalyanram003/TrackBuddy"))
                )
                .externalDocs(new ExternalDocumentation()
                        .description("GitHub Repository")
                        .url("https://github.com/kalyanram003/TrackBuddy"));
    }
}
