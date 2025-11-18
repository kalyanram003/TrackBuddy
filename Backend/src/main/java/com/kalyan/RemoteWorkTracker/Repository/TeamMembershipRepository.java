package com.kalyan.RemoteWorkTracker.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kalyan.RemoteWorkTracker.Model.Team;
import com.kalyan.RemoteWorkTracker.Model.TeamMembership;
import com.kalyan.RemoteWorkTracker.Model.Users;

public interface TeamMembershipRepository extends JpaRepository<TeamMembership, Long> {
    List<TeamMembership> findByTeam(Team team);
    List<TeamMembership> findByUser(Users user);
    Optional<TeamMembership> findByTeamAndUser(Team team, Users user);
}


