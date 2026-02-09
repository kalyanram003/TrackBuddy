package com.kalyan.RemoteWorkTracker.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.kalyan.RemoteWorkTracker.Enums.TaskStatus;
import com.kalyan.RemoteWorkTracker.Model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser_UserId(Long userId);
    List<Task> findByTeamId(Long teamId);
    
    List<Task> findByUserUserId(Long userId);
    
    List<Task> findByUserUserIdAndStatus(Long userId, TaskStatus status);
    
    @Query("SELECT COUNT(t) FROM Task t WHERE t.user.userId = :userId AND t.status = :status")
    Long countByUserAndStatus(@Param("userId") Long userId,
                              @Param("status") TaskStatus status);
}