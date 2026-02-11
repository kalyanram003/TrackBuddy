package com.kalyan.RemoteWorkTracker.Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.kalyan.RemoteWorkTracker.DTOs.ReportSummaryDTO;
import com.kalyan.RemoteWorkTracker.Enums.TaskStatus;
import com.kalyan.RemoteWorkTracker.Model.Task;
import com.kalyan.RemoteWorkTracker.Model.Users;
import com.kalyan.RemoteWorkTracker.Repository.TaskRepository;
import com.kalyan.RemoteWorkTracker.Repository.UserRepository;

@Service
public class ReportService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TaskRepository taskRepository;

    public ReportSummaryDTO generateReport(Long userId) {
        Users user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        List<Task> userTasks = taskRepository.findByUserUserId(userId);
        
        // Count tasks by status 
        long total = userTasks.size();
        long completed = userTasks.stream()
            .filter(task -> task.getStatus() == TaskStatus.DONE)
            .count();
        long pending = userTasks.stream()
            .filter(task -> task.getStatus() == TaskStatus.PENDING)
            .count();
        long inProgress = userTasks.stream()
            .filter(task -> task.getStatus() == TaskStatus.IN_PROGRESS)
            .count();
        long missed = userTasks.stream()
            .filter(task -> task.getStatus() == TaskStatus.MISSED)
            .count();
        
        // Count tasks by priority 
        long highPriority = userTasks.stream()
            .filter(task -> task.getPriority() != null && 
                    task.getPriority().toString().equals("HIGH"))
            .count();
        long midPriority = userTasks.stream()
            .filter(task -> task.getPriority() != null && 
                    task.getPriority().toString().equals("MID"))
            .count();
        long lowPriority = userTasks.stream()
            .filter(task -> task.getPriority() != null && 
                    task.getPriority().toString().equals("LOW"))
            .count();
        
        // Calculate completion rate
        double completionRate = total > 0 ? (completed / (double) total) * 100 : 0;
        
        return new ReportSummaryDTO(
            total,
            completed,
            pending,
            inProgress,
            missed,
            highPriority,
            midPriority,
            lowPriority,
            completionRate
        );
    }
}
