package com.insurance.claim_processing.service;

import com.insurance.claim_processing.entity.ClaimStatus;
import com.insurance.claim_processing.repository.ClaimRepository;
import com.insurance.claim_processing.repository.PolicyRepository;
import com.insurance.claim_processing.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class AdminDashboardService {

    private final UserRepository userRepository;
    private final PolicyRepository policyRepository;
    private final ClaimRepository claimRepository;

    public AdminDashboardService(
            UserRepository userRepository,
            PolicyRepository policyRepository,
            ClaimRepository claimRepository) {

        this.userRepository = userRepository;
        this.policyRepository = policyRepository;
        this.claimRepository = claimRepository;
    }

    public Map<String, Object> getDashboard() {

        Map<String, Object> dashboard = new LinkedHashMap<>();

        dashboard.put("totalUsers", userRepository.count());
        dashboard.put("totalPolicies", policyRepository.count());
        dashboard.put("totalClaims", claimRepository.count());

        dashboard.put(
                "submittedClaims",
                claimRepository.countByStatus(ClaimStatus.SUBMITTED)
        );

        dashboard.put(
                "underReviewClaims",
                claimRepository.countByStatus(ClaimStatus.UNDER_REVIEW)
        );

        dashboard.put(
                "aiAnalyzedClaims",
                claimRepository.countByStatus(ClaimStatus.AI_ANALYZED)
        );

        dashboard.put(
                "moreInformationRequiredClaims",
                claimRepository.countByStatus(
                        ClaimStatus.MORE_INFORMATION_REQUIRED
                )
        );

        dashboard.put(
                "approvedClaims",
                claimRepository.countByStatus(ClaimStatus.APPROVED)
        );

        dashboard.put(
                "rejectedClaims",
                claimRepository.countByStatus(ClaimStatus.REJECTED)
        );

        return dashboard;
    }
}