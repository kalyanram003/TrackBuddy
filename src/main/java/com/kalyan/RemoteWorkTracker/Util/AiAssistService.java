package com.kalyan.RemoteWorkTracker.Util;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.kalyan.RemoteWorkTracker.Config.OpenAiConfig;
import com.kalyan.RemoteWorkTracker.Model.Task;
import com.kalyan.RemoteWorkTracker.Service.TaskService;

@Service
public class AiAssistService {
    

    @Autowired
    private TaskService taskService;

    @Autowired
    private OpenAiConfig openAiConfig;

    @Autowired
    private RestTemplate restTemplate;

    public String getAiAdvice(Long userId){
        List<Task> tasks= taskService.getPriorityTaskById(userId);
        
        
        if(tasks.isEmpty()){
            return "You dont have any pending tasks. great job!";
        }

        String prompt=buildPrompt(tasks);
        return callOpenAiApi(prompt);

    }

    private String buildPrompt(List<Task> tasks){
        StringBuilder sb=new StringBuilder();
        sb.append("You are a productivity assistant. Given this user's task list, suggest the best order to complete the tasks, with a short explanation.\n\n");
        sb.append("Each task includes: description, due date, priority (HIGH, MEDIUM, LOW), and status (PENDING, IN_PROGRESS).\n\n");
        sb.append("You must prefer HIGH priority tasks first, followed by MID, and LOW last.\n\n");
        sb.append("Tasks:\n");

        int index=1;
        for(Task task:tasks){
            sb.append(index++).append(". ").append(task.getDescription()).append("\n")
            .append("Due date").append(task.getDueDate()).append("\n")
            .append("priority").append(task.getPriority()).append("\n")
            .append("status").append(task.getStatus()).append("\n");    
        }
        sb.append("\nRespond in a friendly and helpful tone.Give the order to do the task for example \"sortedTaskIds\": [2, 3, 1], and then give \"reasoning\" Keep your explanation short and clear.\n");

        return sb.toString();
    }

    private String callOpenAiApi(String prompt) {
        String apiUrl=openAiConfig.getApiUrl();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + openAiConfig.getApiKey());
        headers.set("HTTP-Referer", "https://github.com/kalyanram003/TrackBuddy");  
        headers.set("X-Title", "TrackBuddy");  

        Map<String, Object> message = Map.of(
                "role", "user",
                "content", prompt
        );

        Map<String, Object> requestBody = Map.of(
                "model", openAiConfig.getModel(),
                "messages", List.of(message),
                "temperature", 0.7
        );



        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, request, Map.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            Map responseBody = response.getBody();
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseBody.get("choices");

            if (choices != null && !choices.isEmpty()) {
                Map<String, Object> messageObj = (Map<String, Object>) choices.get(0).get("message");
                return (String) messageObj.get("content");
            }
        }

        return "Sorry, I couldn’t get AI advice at the moment.";
    }
    
}
