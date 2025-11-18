package com.kalyan.RemoteWorkTracker.DTOs;

public class DeleteTeamRequest {
    private Long teamId;
    private Long actingUserId; // must be a leader/owner

    public DeleteTeamRequest() {
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public Long getActingUserId() {
        return actingUserId;
    }

    public void setActingUserId(Long actingUserId) {
        this.actingUserId = actingUserId;
    }
}

