package com.kalyan.RemoteWorkTracker.DTOs;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Login request containing email and password")
public class LoginRequest {

    @Schema(description = "User email", example = "example@gmail.com")
    private String email;

    @Schema(description = "User password", example = "password123")
    private String password;

    public LoginRequest() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}