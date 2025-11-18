package com.kalyan.RemoteWorkTracker.DTOs;

public class ModifyMemberRequest {
    private Long teamId;
    private String memberEmail; // Required: members are added by email
    private Long actingUserId; // must be leader of the team

    public ModifyMemberRequest() {
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public String getMemberEmail() {
        return memberEmail;
    }

    public void setMemberEmail(String memberEmail) {
        this.memberEmail = memberEmail;
    }

    public Long getActingUserId() {
        return actingUserId;
    }

    public void setActingUserId(Long actingUserId) {
        this.actingUserId = actingUserId;
    }
}