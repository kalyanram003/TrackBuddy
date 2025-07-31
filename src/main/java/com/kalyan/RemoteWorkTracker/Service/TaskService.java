package com.kalyan.RemoteWorkTracker.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kalyan.RemoteWorkTracker.Model.Task;
import com.kalyan.RemoteWorkTracker.Repository.TaskRepository;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;
    
    public List<Task> getAllTasks(){
        return taskRepository.findAll();
    }

    public Task createTask(Task task){
        task.setStartTime(LocalDateTime.now());
        return taskRepository.save(task);
    }

    public Task getTaskByID(Long Id){
        return taskRepository.findById(Id).orElseThrow(()->new RuntimeException("Task not found"+Id));
    }

    public void deleteTaskByID(Long Id){
        if(!taskRepository.existsById(Id)){
            throw new RuntimeException("Task not found"+Id);
        }
        taskRepository.deleteById(Id);
    }   

}