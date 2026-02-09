package com.kalyan.RemoteWorkTracker.Model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false,unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "total_tasks_completed")
    private Integer totalTasksCompleted = 0;

    @Column(name = "total_tasks_created")
    private Integer totalTasksCreated = 0;

    @Column(name = "average_completion_time_minutes")
    private Double averageCompletionTimeMinutes = 0.0;

    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Task> tasks = new ArrayList<>();

    public Users() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Task> getTasks() {
        return tasks;
    }

    public void setTasks(List<Task> tasks) {
        this.tasks = tasks;
    }

    public Integer getTotalTasksCompleted() {
        return totalTasksCompleted;
    }

    public void setTotalTasksCompleted(Integer totalTasksCompleted) {
        this.totalTasksCompleted = totalTasksCompleted;
    }

    public Integer getTotalTasksCreated() {
        return totalTasksCreated;
    }

    public void setTotalTasksCreated(Integer totalTasksCreated) {
        this.totalTasksCreated = totalTasksCreated;
    }

    public Double getAverageCompletionTimeMinutes() {
        return averageCompletionTimeMinutes;
    }

    public void setAverageCompletionTimeMinutes(Double averageCompletionTimeMinutes) {
        this.averageCompletionTimeMinutes = averageCompletionTimeMinutes;
    }
}
