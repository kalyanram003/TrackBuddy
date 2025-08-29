package com.kalyan.RemoteWorkTracker.DTOs;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "Register request with email and password")
public class RegisterRequest{

    @Schema(description = "User name")
    private String name;

    @Schema(description = "User email", example = "example@gmail.com")
    private String email;

    @Schema(description = "User password", example = "password123")
    private String password;

}
