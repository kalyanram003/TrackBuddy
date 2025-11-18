package com.kalyan.RemoteWorkTracker.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.kalyan.RemoteWorkTracker.DTOs.CreateTeamRequest;
import com.kalyan.RemoteWorkTracker.DTOs.AssignTaskRequest;
import com.kalyan.RemoteWorkTracker.DTOs.ModifyMemberRequest;
import com.kalyan.RemoteWorkTracker.DTOs.DeleteTeamRequest;
import com.kalyan.RemoteWorkTracker.Enums.TeamRole;
import com.kalyan.RemoteWorkTracker.Model.Team;
import com.kalyan.RemoteWorkTracker.Model.TeamMembership;
import com.kalyan.RemoteWorkTracker.Model.Users;
import com.kalyan.RemoteWorkTracker.Model.Task;
import com.kalyan.RemoteWorkTracker.Repository.TeamMembershipRepository;
import com.kalyan.RemoteWorkTracker.Repository.TeamRepository;
import com.kalyan.RemoteWorkTracker.Repository.UserRepository;
import com.kalyan.RemoteWorkTracker.Repository.TaskRepository;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TeamMembershipRepository teamMembershipRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    public Team createTeam(CreateTeamRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Team name is required");
        }

        Users owner = userRepository.findById(request.getOwnerUserId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Owner user not found"));

        teamRepository.findByName(request.getName()).ifPresent(t -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Team name already exists");
        });

        Team team = new Team();
        team.setName(request.getName());
        team.setOwner(owner);

        Team saved = teamRepository.save(team);

        TeamMembership ownerMembership = new TeamMembership();
        ownerMembership.setTeam(saved);
        ownerMembership.setUser(owner);
        ownerMembership.setRole(TeamRole.LEADER);
        teamMembershipRepository.save(ownerMembership);

        return saved;
    }

    public List<Users> listMembers(Long teamId) {
        Team team = teamRepository.findById(teamId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));
        return teamMembershipRepository.findByTeam(team)
            .stream()
            .map(TeamMembership::getUser)
            .collect(Collectors.toList());
    }

    public void addMember(ModifyMemberRequest request) {
        Team team = teamRepository.findById(request.getTeamId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));
        Users actor = userRepository.findById(request.getActingUserId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Acting user not found"));
        Users member = resolveMember(request);

        ensureLeader(actor, team);

        teamMembershipRepository.findByTeamAndUser(team, member).ifPresent(existing -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User already in team");
        });

        TeamMembership m = new TeamMembership();
        m.setTeam(team);
        m.setUser(member);
        m.setRole(TeamRole.MEMBER);
        teamMembershipRepository.save(m);
    }

    public void removeMember(ModifyMemberRequest request) {
        Team team = teamRepository.findById(request.getTeamId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));
        Users actor = userRepository.findById(request.getActingUserId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Acting user not found"));
        Users member = resolveMember(request);

        ensureLeader(actor, team);

        TeamMembership membership = teamMembershipRepository.findByTeamAndUser(team, member)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Membership not found"));

        // prevent removing the only leader
        if (Objects.equals(member.getUserId(), team.getOwner().getUserId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot remove team owner");
        }

        teamMembershipRepository.delete(membership);
    }

    public List<Team> teamsForUser(Long userId) {
        Users user = userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return teamMembershipRepository.findByUser(user)
            .stream()
            .map(TeamMembership::getTeam)
            .collect(Collectors.toList());
    }

    private void ensureLeader(Users actor, Team team) {
        if (!Objects.equals(actor.getUserId(), team.getOwner().getUserId())) {
            // allow any LEADER role to act
            boolean leader = teamMembershipRepository.findByTeam(team).stream()
                .anyMatch(m -> Objects.equals(m.getUser().getUserId(), actor.getUserId()) && m.getRole() == TeamRole.LEADER);
            if (!leader) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only team leaders can perform this action");
            }
        }
    }

    public void deleteTeam(DeleteTeamRequest request) {
        Team team = teamRepository.findById(request.getTeamId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));
        Users actor = userRepository.findById(request.getActingUserId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Acting user not found"));

        // Only owner or any leader can delete
        ensureLeader(actor, team);

        teamRepository.delete(team);
    }
    public Task assignTaskAsLeader(AssignTaskRequest request) {
        Team team = teamRepository.findById(request.getTeamId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Team not found"));
        Users actor = userRepository.findById(request.getActingUserId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Acting user not found"));
        Users assignee = resolveAssignee(request);

        ensureLeader(actor, team);

        boolean isMember = teamMembershipRepository.findByTeamAndUser(team, assignee).isPresent();
        if (!isMember) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Assignee is not a member of the team");
        }

        Task task = new Task();
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setPriority(request.getPriority());
        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }
        task.setScheduledTime(request.getScheduledTime());
        task.setUser(assignee);

        return taskRepository.save(task);
    }

    private Users resolveMember(ModifyMemberRequest request) {
        boolean hasEmail = request.getMemberEmail() != null && !request.getMemberEmail().isBlank();
        boolean hasId = request.getMemberUserId() != null;

        if (!hasEmail && !hasId) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Member email or userId is required");
        }

        if (hasEmail) {
            return userRepository.findByemail(request.getMemberEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member user not found"));
        }

        return userRepository.findById(request.getMemberUserId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member user not found"));
    }

    private Users resolveAssignee(AssignTaskRequest request) {
        boolean hasEmail = request.getAssigneeEmail() != null && !request.getAssigneeEmail().isBlank();
        boolean hasId = request.getAssigneeUserId() != null;

        if (!hasEmail && !hasId) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Assignee email or userId is required");
        }

        if (hasEmail) {
            return userRepository.findByemail(request.getAssigneeEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignee user not found"));
        }

        return userRepository.findById(request.getAssigneeUserId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignee user not found"));
    }
}


