package com.kalyan.RemoteWorkTracker.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kalyan.RemoteWorkTracker.Model.Task;
import com.kalyan.RemoteWorkTracker.Model.Users;
import com.kalyan.RemoteWorkTracker.Repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Users getUserByID(Long Id){
        return userRepository.findById(Id).orElseThrow(()-> new RuntimeException("User not found"));
    }

    public List<Task> getUserTasksById(Long Id){
        return userRepository.findById(Id).orElseThrow(()->new RuntimeException("User not found"+Id)).getTasks();
    }

}
