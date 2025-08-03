package com.kalyan.RemoteWorkTracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RemoteWorkTrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(RemoteWorkTrackerApplication.class, args);
	}

}
