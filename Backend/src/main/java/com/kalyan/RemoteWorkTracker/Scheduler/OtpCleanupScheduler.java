package com.kalyan.RemoteWorkTracker.Scheduler;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.kalyan.RemoteWorkTracker.Service.OtpService;

@Component
public class OtpCleanupScheduler {

    @Autowired
    private OtpService otpService;

    //  Clean up expired OTPs every hour
    @Scheduled(cron = "0 0 * * * *") // Runs at the start of every hour
    public void cleanupExpiredOtps() {
        System.out.println("Running OTP cleanup at: " + LocalDateTime.now());
        otpService.cleanupExpiredOtps();
    }
}
