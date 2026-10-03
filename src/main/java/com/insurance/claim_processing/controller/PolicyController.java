package com.insurance.claim_processing.controller;

import com.insurance.claim_processing.entity.Policy;
import com.insurance.claim_processing.service.PolicyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/policies")
public class PolicyController {

    private final PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    @PostMapping
    public ResponseEntity<Policy> createPolicy(
            @RequestParam String policyNumber,
            @RequestParam String policyType,
            @RequestParam Double coverageAmount,
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam Long userId) {

        Policy policy = policyService.createPolicy(
                policyNumber,
                policyType,
                coverageAmount,
                LocalDate.parse(startDate),
                LocalDate.parse(endDate),
                userId
        );

        return ResponseEntity.ok(policy);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Policy>> getUserPolicies(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                policyService.getPoliciesByUser(userId)
        );
    }
}