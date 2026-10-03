package com.insurance.claim_processing.service;

import com.insurance.claim_processing.entity.Claim;
import com.insurance.claim_processing.entity.Policy;
import com.insurance.claim_processing.repository.ClaimRepository;
import com.insurance.claim_processing.repository.PolicyRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClaimService {

    private final ClaimRepository claimRepository;
    private final PolicyRepository policyRepository;

    public ClaimService(
            ClaimRepository claimRepository,
            PolicyRepository policyRepository) {
        this.claimRepository = claimRepository;
        this.policyRepository = policyRepository;
    }

    public Claim createClaim(
            String claimNumber,
            String description,
            Double claimAmount,
            Long policyId) {

        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new RuntimeException("Policy not found"));

        Claim claim = new Claim();
        claim.setClaimNumber(claimNumber);
        claim.setDescription(description);
        claim.setClaimAmount(claimAmount);
        claim.setPolicy(policy);

        return claimRepository.save(claim);
    }

    public List<Claim> getClaimsByPolicy(Long policyId) {
        return claimRepository.findByPolicyId(policyId);
    }
}