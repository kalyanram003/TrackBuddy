package com.kalyan.RemoteWorkTracker.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kalyan.RemoteWorkTracker.Model.Otp;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    
    Optional<Otp> findByEmailAndOtpCode(String email, String otpCode);
    
    Optional<Otp> findByEmail(String email);
    
    void deleteByEmail(String email);
    
    List<Otp> findByExpiresAtBefore(LocalDateTime dateTime);
}
