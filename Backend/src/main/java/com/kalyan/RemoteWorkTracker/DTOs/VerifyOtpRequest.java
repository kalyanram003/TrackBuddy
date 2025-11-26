package com.kalyan.RemoteWorkTracker.DTOs;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request to verify OTP and create account")
public class VerifyOtpRequest {

    @Schema(description = "User email", example = "john@example.com")
    private String email;

    @Schema(description = "6-digit OTP code", example = "123456")
    private String otpCode;

    @Schema(description = "User name", example = "John Doe")
    private String name;

    @Schema(description = "User password", example = "password123")
    private String password;

    public VerifyOtpRequest() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOtpCode() {
        return otpCode;
    }

    public void setOtpCode(String otpCode) {
        this.otpCode = otpCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
