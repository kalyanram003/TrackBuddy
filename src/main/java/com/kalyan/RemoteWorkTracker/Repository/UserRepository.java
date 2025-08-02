package com.kalyan.RemoteWorkTracker.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.kalyan.RemoteWorkTracker.Model.User;

public interface UserRepository extends JpaRepository<User,Long>{

}
