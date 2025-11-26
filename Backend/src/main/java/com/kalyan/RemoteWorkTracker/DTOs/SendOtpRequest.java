package com.kalyan.RemoteWorkTracker.DTOs;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request to send OTP for registration")
public class SendOtpRequest {

    @Schema(description = "User name", example = "John Doe")
    private String name;

    @Schema(description = "User email", example = "john@example.com")
    private String email;

    @Schema(description = "User password", example = "password123")
    private String password;

    public SendOtpRequest() {
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
