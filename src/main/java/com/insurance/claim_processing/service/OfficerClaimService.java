package com.insurance.claim_processing.service;

import com.insurance.claim_processing.entity.Claim;
import com.insurance.claim_processing.entity.ClaimStatus;
import com.insurance.claim_processing.repository.ClaimRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OfficerClaimService {

    private final ClaimRepository claimRepository;

    public OfficerClaimService(ClaimRepository claimRepository) {
        this.claimRepository = claimRepository;
    }

    public List<Claim> getPendingClaims() {

        return claimRepository.findByStatusIn(
                List.of(
                        ClaimStatus.SUBMITTED,
                        ClaimStatus.AI_ANALYZED,
                        ClaimStatus.MORE_INFORMATION_REQUIRED
                )
        );
    }
}