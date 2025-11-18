package com.kalyan.RemoteWorkTracker.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kalyan.RemoteWorkTracker.Util.AiAssistService;

@RestController
@RequestMapping("/rwt/ai")
public class AiAssistController {

    @Autowired
    private AiAssistService aiAssistService;

    @GetMapping("/advice/{userId}")
    public String getAiAdvice(@PathVariable Long userId){
        return aiAssistService.getAiAdvice(userId);
    }
}

