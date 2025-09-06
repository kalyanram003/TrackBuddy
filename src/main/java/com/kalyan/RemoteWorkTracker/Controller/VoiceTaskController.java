package com.kalyan.RemoteWorkTracker.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


import com.kalyan.RemoteWorkTracker.DTOs.TaskRequest;
import com.kalyan.RemoteWorkTracker.Model.Task;
import com.kalyan.RemoteWorkTracker.Service.TaskService;
import com.kalyan.RemoteWorkTracker.VoiceAssist.VoiceTaskService;
import com.kalyan.RemoteWorkTracker.VoiceAssist.VoiceTaskSessionManager;
import com.kalyan.RemoteWorkTracker.VoiceAssist.VoskTranscriber;

@RestController
@RequestMapping("/rwt/voice-assist")
public class VoiceTaskController {
    @Autowired
    private VoiceTaskService voiceTaskService;

    @Autowired
    private TaskService taskService;

    @PostMapping("/{sessionId}")
    public String handleVoiceTask(
            @PathVariable String sessionId,
            @RequestParam("audio") MultipartFile audioFile
    ) throws Exception {
        String transcript = VoskTranscriber.transcribe(audioFile);

        String response = voiceTaskService.processInput(sessionId, transcript);

        TaskRequest task = VoiceTaskSessionManager.getSessionTask(sessionId);

        if (task.getDescription() != null &&
            task.getDueDate() != null &&
            task.getPriority() != null &&
            task.getStatus() != null &&
            task.getUserId() != null) {

            Task created = taskService.createTask(task);
            VoiceTaskSessionManager.clearSession(sessionId);
            return "Task created successfully: " + created.getDescription();
        }

        return response;
    }
}
