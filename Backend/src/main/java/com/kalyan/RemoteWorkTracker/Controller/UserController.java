package com.kalyan.RemoteWorkTracker.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kalyan.RemoteWorkTracker.Model.Task;
import com.kalyan.RemoteWorkTracker.Model.Users;
import com.kalyan.RemoteWorkTracker.Repository.UserRepository;
import com.kalyan.RemoteWorkTracker.Service.UserService;

@RestController
@RequestMapping("/rwt")
public class UserController {
    @Autowired
    private UserService userService;
    
    @Autowired
    private UserRepository userRepository;


    @GetMapping("/userId/{Id}")
    public Users getUserbyId(@PathVariable Long Id){
        return userService.getUserByID(Id);
    }

    @GetMapping("/userId/{Id}/task")
    public List<Task> getUserTask(@PathVariable Long Id){
        return userService.getUserTasksById(Id);
    }

    @GetMapping("/userByEmail/{email}")
    public Users getUserByEmail(@PathVariable String email){
        return userRepository.findByemail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

}
