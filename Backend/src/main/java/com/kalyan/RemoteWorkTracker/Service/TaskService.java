package com.kalyan.RemoteWorkTracker.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.kalyan.RemoteWorkTracker.DTOs.TaskRequest;
import com.kalyan.RemoteWorkTracker.Enums.TaskStatus;
import com.kalyan.RemoteWorkTracker.Model.Task;
import com.kalyan.RemoteWorkTracker.Model.Users;
import com.kalyan.RemoteWorkTracker.Repository.TaskRepository;
import com.kalyan.RemoteWorkTracker.Repository.UserRepository;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;
    
    public Task createTask(TaskRequest taskRequest){
        Users user = userRepository.findById(taskRequest.getUserId())
        .orElseThrow(() -> new RuntimeException("User not found with id " + taskRequest.getUserId()));
        Task task = new Task();
        task.setDescription(taskRequest.getDescription());
        task.setDueDate(taskRequest.getDueDate());
        task.setPriority(taskRequest.getPriority());

        if (taskRequest.getStatus() == null) {
            task.setStatus(TaskStatus.PENDING);
        } else {
            task.setStatus(taskRequest.getStatus());
        }

        task.setScheduledTime(taskRequest.getScheduledTime());
        task.setUser(user);

        return taskRepository.save(task);
    }

    public List<Task> getAllTasks(){
        return taskRepository.findAll();
    }


    public Task getTaskByID(Long Id){
        return taskRepository.findById(Id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Task not found with id " + Id));
    }

    public void deleteTaskByID(Long Id){
        if(!taskRepository.existsById(Id)){
            throw new RuntimeException("Task not found"+Id);
        }
        taskRepository.deleteById(Id);
    }   

    public Task updateTask(Long taskId, TaskRequest taskRequest) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found with id: " + taskId));
        
        // Update task fields
        if (taskRequest.getDescription() != null) {
            task.setDescription(taskRequest.getDescription());
        }
        if (taskRequest.getDueDate() != null) {
            task.setDueDate(taskRequest.getDueDate());
        }
        if (taskRequest.getPriority() != null) {
            task.setPriority(taskRequest.getPriority());
        }
        if (taskRequest.getStatus() != null) {
            task.setStatus(taskRequest.getStatus());
        }
        if (taskRequest.getScheduledTime() != null) {
            task.setScheduledTime(taskRequest.getScheduledTime());
        }
        
        return taskRepository.save(task);
    }

    // I use COmparator to sort the task according to priority and due date
    public List<Task> getPriorityTaskById(Long userId){
        Users user= userRepository.findById(userId).orElseThrow(()->new RuntimeException("User not found"+userId));
        List<Task> userPriorTasks=user.getTasks().stream()
        .filter(task->task.getStatus()==TaskStatus.PENDING || task.getStatus() == TaskStatus.IN_PROGRESS)
        .sorted(Comparator.comparing(Task::getPriority).reversed().thenComparing(Task::getDueDate)).toList();
        return userPriorTasks;
    }

    public List<Task> findByUserId(Long userId) {
        Users user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found: " + userId));
        return taskRepository.findByUser_UserId(userId);
        
    }


}