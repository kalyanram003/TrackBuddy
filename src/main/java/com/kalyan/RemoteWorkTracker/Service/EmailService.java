package com.kalyan.RemoteWorkTracker.Service;

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
}
