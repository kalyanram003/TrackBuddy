package com.kalyan.RemoteWorkTracker.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kalyan.RemoteWorkTracker.Model.Task;
import com.kalyan.RemoteWorkTracker.Service.TaskService;

@RestController
@RequestMapping("/rwt")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public List<Task> getAllTask(){
        return taskService.getAllTasks();
    }


    @PostMapping("/addTask")
    public Task addTask(@RequestBody Task task){
        return taskService.createTask(task);
    }

    @GetMapping("taskId/{Id}")
    public Task getTask(@PathVariable Long Id){
        return taskService.getTaskByID(Id);
    }
    
    @DeleteMapping("taskId/{Id}")
    public String deleteTask(@PathVariable Long Id){
        taskService.deleteTaskByID(Id);
        return "Task Deleted Successfully";
    }

    @GetMapping("users/{Id}/prior-tasks")
    public List<Task> priorTaskList(@PathVariable Long Id){
        return taskService.getPriorityTaskById(Id);
    }
    
    
}
