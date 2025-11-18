package com.kalyan.RemoteWorkTracker.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kalyan.RemoteWorkTracker.Model.Users;

public interface UserRepository extends JpaRepository<Users,Long>{
    Optional<Users> findByemail(String email);
}
