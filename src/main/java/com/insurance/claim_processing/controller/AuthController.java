package com.insurance.claim_processing.controller;

import com.insurance.claim_processing.dto.LoginRequest;
import com.insurance.claim_processing.dto.LoginResponse;
import com.insurance.claim_processing.dto.UserResponse;
import com.insurance.claim_processing.entity.User;
import com.insurance.claim_processing.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password) {

        User user = userService.registerUser(name, email, password);

        UserResponse response = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request) {

        User user = userService.loginUser(
                request.getEmail(),
                request.getPassword()
        );

        String token = userService.generateToken(user);

        LoginResponse response = new LoginResponse(
                token,
                user.getEmail(),
                user.getRole().name()
        );

        return ResponseEntity.ok(response);
    }
}