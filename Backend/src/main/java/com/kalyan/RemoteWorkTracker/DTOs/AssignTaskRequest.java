package com.kalyan.RemoteWorkTracker.DTOs;

import java.time.LocalDateTime;

import com.kalyan.RemoteWorkTracker.Enums.Priority;
import com.kalyan.RemoteWorkTracker.Enums.TaskStatus;

public class AssignTaskRequest {
    private Long teamId;
    private Long actingUserId;    // must be a team leader
    private Long assigneeUserId;  // must be member of the team
    private String assigneeEmail; // optional alternative to userId

    private String description;
    private LocalDateTime dueDate;
    private Priority priority;
    private TaskStatus status;
    private LocalDateTime scheduledTime;

    public AssignTaskRequest() {
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public Long getActingUserId() {
        return actingUserId;
    }

    public void setActingUserId(Long actingUserId) {
        this.actingUserId = actingUserId;
    }

    public Long getAssigneeUserId() {
        return assigneeUserId;
    }

    public void setAssigneeUserId(Long assigneeUserId) {
        this.assigneeUserId = assigneeUserId;
    }

    public String getAssigneeEmail() {
        return assigneeEmail;
    }

    public void setAssigneeEmail(String assigneeEmail) {
        this.assigneeEmail = assigneeEmail;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate) {
        this.dueDate = dueDate;
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
}