package com.kalyan.RemoteWorkTracker.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kalyan.RemoteWorkTracker.Util.EmailService;

@RestController
@RequestMapping("/emailTest")
public class EmailTestController {
    @Autowired
    private EmailService emailService;
    

    @GetMapping
    public String testEmail(@RequestParam String to,
        @RequestParam String subject,
        @RequestParam String body){
            emailService.sendMail(to, subject, body);
            return "Mail send successfully";
    }
}
