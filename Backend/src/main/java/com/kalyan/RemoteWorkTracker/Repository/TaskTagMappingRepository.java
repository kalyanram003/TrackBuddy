package com.kalyan.RemoteWorkTracker.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.kalyan.RemoteWorkTracker.Model.TaskTagMapping;

@Repository
public interface TaskTagMappingRepository extends JpaRepository<TaskTagMapping, Long> {

    List<TaskTagMapping> findByTaskTaskId(Long taskId);

    List<TaskTagMapping> findByTagId(Long tagId);

    void deleteByTaskTaskId(Long taskId);
}
