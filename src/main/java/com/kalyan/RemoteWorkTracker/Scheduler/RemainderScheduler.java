package com.kalyan.RemoteWorkTracker.Scheduler;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.kalyan.RemoteWorkTracker.Enums.TaskStatus;
import com.kalyan.RemoteWorkTracker.Model.Task;
import com.kalyan.RemoteWorkTracker.Repository.TaskRepository;
import com.kalyan.RemoteWorkTracker.Util.EmailService;

@Component
public class RemainderScheduler {
    
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private EmailService emailService;

    @Scheduled(cron = "0 */1 * * * *")
    public void sendTaskRemainder(){
        List<Task> tasks=taskRepository.findAll();
        LocalDateTime now =LocalDateTime.now();

        for(Task tsk:tasks){
            if((tsk.getStatus()==TaskStatus.PENDING || tsk.getStatus()==TaskStatus.MISSED)
                && tsk.getScheduledTime()!=null && tsk.getScheduledTime().isBefore(now) 
                &&tsk.getReminderSentAt()==null
            ){
                String email=tsk.getUser().getEmail();
                String subject="Remainder for the work"+tsk.getDescription();
                String body="Hey " + tsk.getUser().getName() + ",\n\n"
                    + "Just a reminder for your scheduled task:\n"
                    + "- Description: " + tsk.getDescription() + "\n"
                    + "- Due Date: " + tsk.getDueDate() + "\n\n"
                    + "Please check it before the deadline!\n\n"
                    + "— TrackBuddy";

                emailService.sendMail(email, subject, body);
                tsk.setReminderSentAt(LocalDateTime.now());
                taskRepository.save(tsk);
            }
        }
    }
}
