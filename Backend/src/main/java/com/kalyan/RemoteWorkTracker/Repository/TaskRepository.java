package com.kalyan.RemoteWorkTracker.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.kalyan.RemoteWorkTracker.Model.Task;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser_UserId(Long userId);
    List<Task> findByTeamId(Long teamId);
}