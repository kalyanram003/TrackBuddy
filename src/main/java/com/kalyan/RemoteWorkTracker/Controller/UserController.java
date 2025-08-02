package com.kalyan.RemoteWorkTracker.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kalyan.RemoteWorkTracker.Model.User;
import com.kalyan.RemoteWorkTracker.Service.UserService;

@RestController
@RequestMapping("rwt")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/addUser")
    public User createUser(@RequestBody User user){
        return userService.createUser(user);
    }

    @GetMapping("/userId/{Id}")
    public User getUserbyId(@PathVariable Long Id){
        return userService.getUserByID(Id);
    }
}
