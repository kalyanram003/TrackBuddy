package com.kalyan.RemoteWorkTracker.Controller;

import java.io.ByteArrayInputStream;
import java.util.List;
import org.springframework.http.*;


import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.itextpdf.text.DocumentException;
import com.kalyan.RemoteWorkTracker.DTOs.TaskRequest;
import com.kalyan.RemoteWorkTracker.Model.Task;
import com.kalyan.RemoteWorkTracker.Service.TaskService;
import com.kalyan.RemoteWorkTracker.Util.PdfReportService;

@RestController
@RequestMapping("/rwt")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private PdfReportService pdfReportService;

    @GetMapping("/allTasks")
    public List<Task> getAllTask(){
        return taskService.getAllTasks();
    }


    @PostMapping("/addTask")
    public ResponseEntity<?> addTask(@RequestBody TaskRequest request){
        try {
            System.out.println("=== TASK CREATION REQUEST ===");
            System.out.println("Description: " + request.getDescription());
            System.out.println("Priority: " + request.getPriority());
            System.out.println("Status: " + request.getStatus());
            System.out.println("UserId: " + request.getUserId());
            System.out.println("DueDate: " + request.getDueDate());
            System.out.println("ScheduledTime: " + request.getScheduledTime());
            System.out.println("===============================");
            
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated()) {
                System.out.println("User authenticated: " + auth.getName());
                System.out.println("User authorities: " + auth.getAuthorities());
            } else {
                System.out.println("No authentication found in context");
            }
            
            Task createdTask = taskService.createTask(request);
            System.out.println("Task created successfully with ID: " + createdTask.getTaskId());
            
            return ResponseEntity.ok(createdTask);
        } catch (Exception e) {
            System.err.println("Error creating task: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error creating task: " + e.getMessage());
        }
    }

    @GetMapping("/taskId/{Id}")
    public Task getTask(@PathVariable Long Id){
        return taskService.getTaskByID(Id);
    }
    
    @DeleteMapping("/taskId/{Id}")
    public String deleteTask(@PathVariable Long Id){
        taskService.deleteTaskByID(Id);
        return "Task Deleted Successfully";
    }

    @PutMapping("/taskId/{Id}")
    public ResponseEntity<?> updateTask(@PathVariable Long Id, @RequestBody TaskRequest request){
        try {
            Task updatedTask = taskService.updateTask(Id, request);
            return ResponseEntity.ok(updatedTask);
        } catch (Exception e) {
            System.err.println("Error updating task: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error updating task: " + e.getMessage());
        }
    }

    @GetMapping("/users/{Id}/prior-tasks")
    public List<Task> priorTaskList(@PathVariable Long Id){
        return taskService.getPriorityTaskById(Id);
    }
    

    @GetMapping("/users/{userId}/tasks/pdf")
    public ResponseEntity<InputStreamResource> downloadTaskReport(@PathVariable Long userId) throws DocumentException {
        ByteArrayInputStream pdf = pdfReportService.generatePdfReport(userId);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=task_report_user_"+userId+".pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdf));
    }

    @PostMapping("/testTask")
    public ResponseEntity<?> testTask(@RequestBody TaskRequest request) {
        try {
            System.out.println("Received TaskRequest:");
            System.out.println("Description: " + request.getDescription());
            System.out.println("Priority: " + request.getPriority());
            System.out.println("Status: " + request.getStatus());
            System.out.println("UserId: " + request.getUserId());
            System.out.println("DueDate: " + request.getDueDate());
            System.out.println("ScheduledTime: " + request.getScheduledTime());
            
            return ResponseEntity.ok("Test successful - data received correctly");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Test failed: " + e.getMessage());
        }
    }

    
}
