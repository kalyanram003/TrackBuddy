package com.kalyan.RemoteWorkTracker.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.kalyan.RemoteWorkTracker.Model.Otp;
import com.kalyan.RemoteWorkTracker.Repository.OtpRepository;

@Service
public class OtpService {

    @Autowired
    private OtpRepository otpRepository;

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 10;

    //  Generate a 6-digit OTP and save it to the database
    //  If an OTP already exists for this email, delete it first
    @Transactional
    public String generateOtp(String email) {
        // Delete any existing OTP for this email
        otpRepository.deleteByEmail(email);

        // Generate random 6-digit OTP
        String otpCode = generateRandomOtp();

        // Create OTP entity
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusMinutes(OTP_EXPIRY_MINUTES);
        
        Otp otp = new Otp(email, otpCode, now, expiresAt);
        otpRepository.save(otp);

        return otpCode;
    }

    
    //  Validate OTP for the given email
    //  Returns true if OTP is valid and not expired
     
    public boolean validateOtp(String email, String otpCode) {
        Optional<Otp> otpOptional = otpRepository.findByEmailAndOtpCode(email, otpCode);

        if (otpOptional.isEmpty()) {
            return false;
        }

        Otp otp = otpOptional.get();

        // Check if OTP is expired
        if (LocalDateTime.now().isAfter(otp.getExpiresAt())) {
            return false;
        }

        // Check if already verified
        if (otp.getVerified()) {
            return false;
        }

        // Mark as verified
        otp.setVerified(true);
        otpRepository.save(otp);

        return true;
    }

    //  Clean up expired OTPs from the database
    @Transactional
    public void cleanupExpiredOtps() {
        LocalDateTime now = LocalDateTime.now();
        var expiredOtps = otpRepository.findByExpiresAtBefore(now);
        otpRepository.deleteAll(expiredOtps);
    }

    //  Generate a random 6-digit OTP
    private String generateRandomOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // Generates number between 100000 and 999999
        return String.valueOf(otp);
    }
}
