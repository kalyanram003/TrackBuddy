package com.kalyan.RemoteWorkTracker.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.kalyan.RemoteWorkTracker.Config.JwtUtil;
import com.kalyan.RemoteWorkTracker.DTOs.LoginRequest;
import com.kalyan.RemoteWorkTracker.DTOs.RegisterRequest;
import com.kalyan.RemoteWorkTracker.DTOs.SendOtpRequest;
import com.kalyan.RemoteWorkTracker.DTOs.VerifyOtpRequest;
import com.kalyan.RemoteWorkTracker.Model.Users;
import com.kalyan.RemoteWorkTracker.Repository.UserRepository;
import com.kalyan.RemoteWorkTracker.Service.OtpService;
import com.kalyan.RemoteWorkTracker.Util.EmailService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/rwt/auth")
@Tag(name = "Authentication", description = "Endpoints for registration and login")
public class AuthController {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtUtil jwtUtil;
	private final AuthenticationManager authenticationManager;
	private final OtpService otpService;
	private final EmailService emailService;

	@Autowired
	public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil, 
			AuthenticationManager authenticationManager, OtpService otpService, EmailService emailService) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtUtil = jwtUtil;
		this.authenticationManager = authenticationManager;
		this.otpService = otpService;
		this.emailService = emailService;
	}


	@Operation(summary = "Send OTP for registration", description = "Send OTP to email for account verification")
	@PostMapping("/send-otp")
	public ResponseEntity<?> sendOtp(@RequestBody SendOtpRequest request) {
		// Check if email is already registered
		if (userRepository.findByemail(request.getEmail()).isPresent()) {
			return ResponseEntity.badRequest().body("Error: Email is already registered!");
		}

		try {
			// Generate OTP
			String otpCode = otpService.generateOtp(request.getEmail());
			
			// Send OTP via email
			emailService.sendOtpEmail(request.getEmail(), otpCode);
			
			return ResponseEntity.ok("OTP sent successfully to " + request.getEmail());
		} catch (Exception e) {
			return ResponseEntity.status(500).body("Error sending OTP. Please try again.");
		}
	}

	@Operation(summary = "Verify OTP and create account", description = "Verify OTP code and create user account")
	@PostMapping("/verify-otp")
	public ResponseEntity<?> verifyOtpAndRegister(@RequestBody VerifyOtpRequest request) {
		// Validate OTP
		if (!otpService.validateOtp(request.getEmail(), request.getOtpCode())) {
			return ResponseEntity.badRequest().body("Invalid or expired OTP");
		}

		// Check if email is already registered (double-check)
		if (userRepository.findByemail(request.getEmail()).isPresent()) {
			return ResponseEntity.badRequest().body("Error: Email is already registered!");
		}

		// Create user account
		Users user = new Users();
		user.setName(request.getName());
		user.setEmail(request.getEmail());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		userRepository.save(user);

		return ResponseEntity.ok("Account created successfully! Please login.");
	}

	@Deprecated
	@Operation(summary = "Register a new user (Deprecated)", description = "Use /send-otp and /verify-otp instead")
	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
		if (userRepository.findByemail(request.getEmail()).isPresent()) {
		return ResponseEntity.badRequest().body("Error: Email is already registered!");
	}
		Users user = new Users();
		user.setName(request.getName());
        user.setEmail(request.getEmail());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		userRepository.save(user);
		return ResponseEntity.ok("User registered successfully");
	}		


	@Operation(summary = "Login user", description = "Provide email and password to generate JWT token")
	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
		try{
			Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
			);
			UserDetails userDetails = (UserDetails) authentication.getPrincipal();
			String jwtToken = jwtUtil.generateToken(userDetails.getUsername());

			Users user = userRepository.findByemail(userDetails.getUsername())
				.orElseThrow(() -> new RuntimeException("User not found"));

			Map<String, Object> response = new HashMap<>();
			response.put("token", jwtToken);
			response.put("Email", userDetails.getUsername());
			response.put("userId", user.getUserId());
			response.put("name", user.getName());
	
			return ResponseEntity.ok(response);
		}
		catch (Exception e) {
			return ResponseEntity.status(401).body("Invalid credentials");
		}
	}
}
