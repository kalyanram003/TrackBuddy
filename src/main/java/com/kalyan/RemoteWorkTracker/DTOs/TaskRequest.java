package com.kalyan.RemoteWorkTracker.DTOs;
import java.time.LocalDateTime;

import com.kalyan.RemoteWorkTracker.Enums.Priority;
import com.kalyan.RemoteWorkTracker.Enums.TaskStatus;

import io.swagger.v3.oas.annotations.Parameter;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskRequest {

    @Parameter(description = "Task description, example = Prepare project report")
    private String description;

    @Parameter(description = "Due date in ISO format example = 2025-08-25T17:00:00")
    private LocalDateTime dueDate;

    @Parameter(description = "Task priority", example = "HIGH")
    private Priority priority;

    @Parameter(description = "Task status", example = "PENDING")
    private TaskStatus status;

    @Parameter(description = "Scheduled time example = 2025-08-23T10:30:00")
    private LocalDateTime scheduledTime;

    @Parameter(description = "User ID who owns the task example = 1")
    private Long userId;
}

