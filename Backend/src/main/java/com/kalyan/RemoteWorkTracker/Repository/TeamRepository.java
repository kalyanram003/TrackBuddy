package com.kalyan.RemoteWorkTracker.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kalyan.RemoteWorkTracker.Model.Team;
import com.kalyan.RemoteWorkTracker.Model.Users;

public interface TeamRepository extends JpaRepository<Team, Long> {
    Optional<Team> findByName(String name);
    List<Team> findByOwner(Users owner);
}


