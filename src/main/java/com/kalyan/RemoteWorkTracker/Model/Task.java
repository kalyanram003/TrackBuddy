package com.kalyan.RemoteWorkTracker.Model;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kalyan.RemoteWorkTracker.Enums.Priority;
import com.kalyan.RemoteWorkTracker.Enums.TaskStatus;

import jakarta.persistence.*;


@Entity 
public class Task {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private String description; 
    private LocalDateTime dueData;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    private LocalDateTime scheduledTime;
    private Long userId;

    @CreationTimestamp
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private LocalDateTime startTime;

    public Task(Long id, String description, LocalDateTime dueData, Priority priority, TaskStatus status,
            LocalDateTime scheduledTime, Long userId, LocalDateTime startTime) {
        this.id = id;
        this.description = description;
        this.dueData = dueData;
        this.priority = priority;
        this.status = status;
        this.scheduledTime = scheduledTime;
        this.userId = userId;
        this.startTime = startTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDueData() {
        return dueData;
    }

    public void setDueData(LocalDateTime dueData) {
        this.dueData = dueData;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public LocalDateTime getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(LocalDateTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    
}
