package com.kalyan.RemoteWorkTracker.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.itextpdf.text.pdf.PdfStructTreeController.returnType;
import com.kalyan.RemoteWorkTracker.Enums.TaskStatus;
import com.kalyan.RemoteWorkTracker.Model.Task;
import com.kalyan.RemoteWorkTracker.Model.User;
import com.kalyan.RemoteWorkTracker.Repository.TaskRepository;
import com.kalyan.RemoteWorkTracker.Repository.UserRepository;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;
    
    public Task createTask(Task task){
        if(task.getStatus()==null){
            task.setStatus(TaskStatus.PENDING);
        }
        task.setStartTime(LocalDateTime.now());
        return taskRepository.save(task);
    }

    public List<Task> getAllTasks(){
        return taskRepository.findAll();
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

    // I use COmparator to sort the task according to priority and due date
    public List<Task> getPriorityTaskById(Long userId){
        User user= userRepository.findById(userId).orElseThrow(()->new RuntimeException("User not found"+userId));
        List<Task> userPriorTasks=user.getTasks().stream()
        .filter(task->task.getStatus()==TaskStatus.PENDING || task.getStatus() == TaskStatus.IN_PROGRESS)
        .sorted(Comparator.comparing(Task::getPriority).reversed().thenComparing(Task::getDueDate)).toList();
        return userPriorTasks;
    }

    public List<Task> findByUserId(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found: " + userId));
        return taskRepository.findByUser_UserId(userId);
        
    }


}