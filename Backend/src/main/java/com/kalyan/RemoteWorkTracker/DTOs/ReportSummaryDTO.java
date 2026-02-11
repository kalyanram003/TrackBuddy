package com.kalyan.RemoteWorkTracker.DTOs;

public class ReportSummaryDTO {
    private Long total;
    private Long completed;
    private Long pending;
    private Long inProgress;
    private Long missed;
    private Long highPriority;
    private Long midPriority;
    private Long lowPriority;
    private Double completionRate;

    public ReportSummaryDTO(Long total, Long completed, Long pending, Long inProgress, 
                           Long missed, Long highPriority, Long midPriority, 
                           Long lowPriority, Double completionRate) {
        this.total = total;
        this.completed = completed;
        this.pending = pending;
        this.inProgress = inProgress;
        this.missed = missed;
        this.highPriority = highPriority;
        this.midPriority = midPriority;
        this.lowPriority = lowPriority;
        this.completionRate = completionRate;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public Long getCompleted() {
        return completed;
    }

    public void setCompleted(Long completed) {
        this.completed = completed;
    }

    public Long getPending() {
        return pending;
    }

    public void setPending(Long pending) {
        this.pending = pending;
    }

    public Long getInProgress() {
        return inProgress;
    }

    public void setInProgress(Long inProgress) {
        this.inProgress = inProgress;
    }

    public Long getMissed() {
        return missed;
    }

    public void setMissed(Long missed) {
        this.missed = missed;
    }

    public Long getHighPriority() {
        return highPriority;
    }

    public void setHighPriority(Long highPriority) {
        this.highPriority = highPriority;
    }

    public Long getMidPriority() {
        return midPriority;
    }

    public void setMidPriority(Long midPriority) {
        this.midPriority = midPriority;
    }

    public Long getLowPriority() {
        return lowPriority;
    }

    public void setLowPriority(Long lowPriority) {
        this.lowPriority = lowPriority;
    }

    public Double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(Double completionRate) {
        this.completionRate = completionRate;
    }

    @Override
    public String toString() {
        return "ReportSummaryDTO{" +
                "total=" + total +
                ", completed=" + completed +
                ", pending=" + pending +
                ", inProgress=" + inProgress +
                ", missed=" + missed +
                ", highPriority=" + highPriority +
                ", midPriority=" + midPriority +
                ", lowPriority=" + lowPriority +
                ", completionRate=" + completionRate +
                '}';
    }
}
