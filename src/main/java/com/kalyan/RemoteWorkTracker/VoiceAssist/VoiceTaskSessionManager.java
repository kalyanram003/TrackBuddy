package com.kalyan.RemoteWorkTracker.VoiceAssist;

import java.util.HashMap;
import java.util.Map;

import com.kalyan.RemoteWorkTracker.DTOs.TaskRequest;

public class VoiceTaskSessionManager {
    private static Map<String, TaskRequest> sessionTasks = new HashMap<>();
    
    public static TaskRequest getSessionTask(String sessionId) {
        return sessionTasks.computeIfAbsent(sessionId, k -> new TaskRequest());
    }
    
    public static void clearSession(String sessionId) {
        sessionTasks.remove(sessionId);
    }
}
