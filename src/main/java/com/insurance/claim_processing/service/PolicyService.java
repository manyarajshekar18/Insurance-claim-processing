package com.insurance.claim_processing.service;

import com.insurance.claim_processing.entity.Policy;
import com.insurance.claim_processing.entity.User;
import com.insurance.claim_processing.repository.PolicyRepository;
import com.insurance.claim_processing.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PolicyService {

    private final PolicyRepository policyRepository;
    private final UserRepository userRepository;

    public PolicyService(
            PolicyRepository policyRepository,
            UserRepository userRepository) {
        this.policyRepository = policyRepository;
        this.userRepository = userRepository;
    }

    public Policy createPolicy(
            String policyNumber,
            String policyType,
            Double coverageAmount,
            java.time.LocalDate startDate,
            java.time.LocalDate endDate,
            Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Policy policy = new Policy();
        policy.setPolicyNumber(policyNumber);
        policy.setPolicyType(policyType);
        policy.setCoverageAmount(coverageAmount);
        policy.setStartDate(startDate);
        policy.setEndDate(endDate);
        policy.setUser(user);

        return policyRepository.save(policy);
    }

    public List<Policy> getPoliciesByUser(Long userId) {
        return policyRepository.findByUserId(userId);
    }
}