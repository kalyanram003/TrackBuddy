package com.kalyan.RemoteWorkTracker.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kalyan.RemoteWorkTracker.Model.User;

public interface UserRepository extends JpaRepository<User,Long>{
    Optional<User> findByemail(String email);
}
