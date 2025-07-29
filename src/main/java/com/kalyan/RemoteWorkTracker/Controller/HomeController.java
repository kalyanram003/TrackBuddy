package com.kalyan.RemoteWorkTracker.Controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
public class HomeController {
    @GetMapping
    public String home() {
        return "Welcome to the Remote Work Tracker!";
    }
}
