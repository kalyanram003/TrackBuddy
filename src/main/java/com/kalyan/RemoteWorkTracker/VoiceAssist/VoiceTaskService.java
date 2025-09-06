package com.kalyan.RemoteWorkTracker.VoiceAssist;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.kalyan.RemoteWorkTracker.DTOs.TaskRequest;
import com.kalyan.RemoteWorkTracker.Enums.Priority;
import com.kalyan.RemoteWorkTracker.Enums.TaskStatus;

@Service
public class VoiceTaskService {
    public String processInput(String sessionId, String transcript) {
        TaskRequest task = VoiceTaskSessionManager.getSessionTask(sessionId);

        if (task.getDescription() == null) {
            task.setDescription(transcript);
            return "Got it. When is this due?";
        }

        if (task.getDueDate() == null) {
            task.setDueDate(LocalDateTime.now().plusDays(1)); 
            return "What’s the priority? Low, Medium, or High?";
        }

        if (task.getPriority() == null) {
            switch (transcript.toLowerCase()) {
                case "low" -> task.setPriority(Priority.LOW);
                case "medium" -> task.setPriority(Priority.MID);
                case "high" -> task.setPriority(Priority.HIGH);
            }
            return "Is the task pending, in-progress, or completed?";
        }

        if (task.getStatus() == null) {
            switch (transcript.toLowerCase()) {
                case "pending" -> task.setStatus(TaskStatus.PENDING);
                case "in progress", "in-progress" -> task.setStatus(TaskStatus.IN_PROGRESS);
                case "completed" -> task.setStatus(TaskStatus.COMPLETED);
            }
            return "Do you want to schedule a reminder? Say a time or skip.";
        }

        if (task.getScheduledTime() == null) {
            if (!transcript.equalsIgnoreCase("skip")) {
                task.setScheduledTime(LocalDateTime.now().plusHours(2)); 
            }
            return "Which user ID should this task belong to?";
        }

        if (task.getUserId() == null) {
            try {
                task.setUserId(Long.parseLong(transcript));
            } catch (Exception e) {
                return "Please say a valid numeric user ID.";
            }
            return "All details captured. Task will be created.";
        }

        return "Task already complete.";
    }
}
