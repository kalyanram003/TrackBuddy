package com.kalyan.RemoteWorkTracker.Repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kalyan.RemoteWorkTracker.Model.TaskTag;

@Repository
public interface TaskTagRepository extends JpaRepository<TaskTag, Long> {

    List<TaskTag> findByUserUserId(Long userId);

    Optional<TaskTag> findByNameAndUserUserId(String name, Long userId);

    boolean existsByNameAndUserUserId(String name, Long userId);
}
