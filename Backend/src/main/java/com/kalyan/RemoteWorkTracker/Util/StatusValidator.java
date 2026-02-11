package main.java.com.kalyan.RemoteWorkTracker.Util;

import com.kalyan.RemoteWorkTracker.Enums.TaskStatus;


public class StatusValidator {
    

    public static TaskStatus normalizeStatus(String statusString) {
        if (statusString == null || statusString.trim().isEmpty()) {
            throw new IllegalArgumentException("Status cannot be null or empty");
        }
        
        String normalized = statusString.trim().toUpperCase();
        
        try {
            return TaskStatus.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            switch (normalized) {
                case "COMPLETED":
                    return TaskStatus.DONE;
                case "DONE":
                    return TaskStatus.DONE;
                case "PENDING":
                    return TaskStatus.PENDING;
                case "IN_PROGRESS":
                    return TaskStatus.IN_PROGRESS;
                case "MISSED":
                    return TaskStatus.MISSED;
                default:
                    throw new IllegalArgumentException(
                        "Invalid status: " + statusString + 
                        ". Valid statuses are: PENDING, IN_PROGRESS, DONE, MISSED"
                    );
            }
        }
    }
 
    public static boolean isValidStatus(String statusString) {
        try {
            normalizeStatus(statusString);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }
    
   
    public static String getValidStatusValues() {
        return "PENDING, IN_PROGRESS, DONE, MISSED";
    }
}
