package com.kalyan.RemoteWorkTracker.DTOs;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Register request with email and password")
public class RegisterRequest{

    @Schema(description = "User name")
    private String name;

    @Schema(description = "User email", example = "example@gmail.com")
    private String email;

    @Schema(description = "User password", example = "password123")
    private String password;

    public RegisterRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
