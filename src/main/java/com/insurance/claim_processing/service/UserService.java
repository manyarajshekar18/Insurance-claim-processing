package com.insurance.claim_processing.service;

import com.insurance.claim_processing.entity.Role;
import com.insurance.claim_processing.entity.User;
import com.insurance.claim_processing.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(String name, String email, String password) {

        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();

        user.setName(name);
        user.setEmail(email);

        // Hash the password before storing it
        user.setPassword(passwordEncoder.encode(password));

        user.setRole(Role.CUSTOMER);

        return userRepository.save(user);
    }
}