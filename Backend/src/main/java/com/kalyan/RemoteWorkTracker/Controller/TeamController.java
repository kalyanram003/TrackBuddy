package com.kalyan.RemoteWorkTracker.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.kalyan.RemoteWorkTracker.DTOs.CreateTeamRequest;
import com.kalyan.RemoteWorkTracker.DTOs.ModifyMemberRequest;
import com.kalyan.RemoteWorkTracker.DTOs.AssignTaskRequest;
import com.kalyan.RemoteWorkTracker.DTOs.DeleteTeamRequest;
import com.kalyan.RemoteWorkTracker.Model.Team;
import com.kalyan.RemoteWorkTracker.Model.Users;
import com.kalyan.RemoteWorkTracker.Model.Task;
import com.kalyan.RemoteWorkTracker.Service.TeamService;

@RestController
@RequestMapping("/rwt/teams")
public class TeamController {

    @Autowired
    private TeamService teamService;

    @PostMapping
    public ResponseEntity<Team> createTeam(@RequestBody CreateTeamRequest request) {
        return ResponseEntity.ok(teamService.createTeam(request));
    }

    @GetMapping("/members")
    public ResponseEntity<List<Users>> listMembers(@RequestParam Long teamId) {
        return ResponseEntity.ok(teamService.listMembers(teamId));
    }

    @PostMapping("/members")
    public ResponseEntity<String> addMember(@RequestBody ModifyMemberRequest request) {
        teamService.addMember(request);
        return ResponseEntity.ok("Member added");
    }

    @DeleteMapping("/members")
    public ResponseEntity<String> removeMember(@RequestBody ModifyMemberRequest request) {
        teamService.removeMember(request);
        return ResponseEntity.ok("Member removed");
    }

    @GetMapping("/mine")
    public ResponseEntity<List<Team>> myTeams(@RequestParam Long userId) {
        return ResponseEntity.ok(teamService.teamsForUser(userId));
    }

    @PostMapping("/assignTask")
    public ResponseEntity<Task> assignTask(@RequestBody AssignTaskRequest request) {
        return ResponseEntity.ok(teamService.assignTaskAsLeader(request));
    }

    @DeleteMapping
    public ResponseEntity<String> deleteTeam(@RequestBody DeleteTeamRequest request) {
        teamService.deleteTeam(request);
        return ResponseEntity.ok("Team deleted");
    }

    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getTeamTasks(@RequestParam Long teamId, @RequestParam Long actingUserId) {
        return ResponseEntity.ok(teamService.getTeamTasks(teamId, actingUserId));
    }
}


