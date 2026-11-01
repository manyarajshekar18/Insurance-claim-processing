package com.insurance.claim_processing.service;

import com.insurance.claim_processing.entity.Claim;
import com.insurance.claim_processing.entity.Policy;
import com.insurance.claim_processing.entity.Role;
import com.insurance.claim_processing.entity.User;
import com.insurance.claim_processing.repository.ClaimRepository;
import com.insurance.claim_processing.repository.PolicyRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Policy not found"));

        Claim claim = new Claim();

        claim.setClaimNumber(claimNumber);
        claim.setDescription(description);
        claim.setClaimAmount(claimAmount);
        claim.setPolicy(policy);

        return claimRepository.save(claim);
    }

    public List<Claim> getClaimsByPolicy(
            Long policyId,
            Authentication authentication) {

        Policy policy = policyRepository.findById(policyId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Policy not found"));

        validateOwnership(policy, authentication);

        return claimRepository.findByPolicyId(policyId);
    }

    public Claim getClaimById(
            Long claimId,
            Authentication authentication) {

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Claim not found"));

        validateOwnership(claim.getPolicy(), authentication);

        return claim;
    }

    private void validateOwnership(
            Policy policy,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        if (user.getRole() == Role.ADMIN ||
                user.getRole() == Role.OFFICER) {
            return;
        }

        if (policy.getUser().getId().equals(user.getId())) {
            return;
        }

        throw new ResponseStatusException(
                HttpStatus.FORBIDDEN,
                "You are not authorized to access this claim");
    }
}