package com.kalyan.RemoteWorkTracker.Util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendMail(String to,String subject,String body){
        try {
            SimpleMailMessage message=new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            
            javaMailSender.send(message);
        } catch (MailException e) {
            System.out.println("Error in sending mail"+e);
        }

    }

    public void sendOtpEmail(String to, String otpCode) {
        String subject = "TrackBuddy - Your OTP for Account Registration";
        String body = String.format(
            "Hello,\n\n" +
            "Thank you for registering with TrackBuddy!\n\n" +
            "Your One-Time Password (OTP) for account verification is: %s\n\n" +
            "This OTP is valid for 10 minutes.\n\n" +
            "If you did not request this OTP, please ignore this email.\n\n" +
            "Best regards,\n" +
            "TrackBuddy Team",
            otpCode
        );
        sendMail(to, subject, body);
    }
}

