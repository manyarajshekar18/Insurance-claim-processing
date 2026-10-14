package com.insurance.claim_processing.service;

import com.insurance.claim_processing.entity.Claim;
import com.insurance.claim_processing.entity.ClaimReview;
import com.insurance.claim_processing.entity.ClaimStatus;
import com.insurance.claim_processing.entity.Role;
import com.insurance.claim_processing.entity.User;
import com.insurance.claim_processing.repository.ClaimRepository;
import com.insurance.claim_processing.repository.ClaimReviewRepository;
import com.insurance.claim_processing.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClaimReviewService {

    private final ClaimRepository claimRepository;
    private final ClaimReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public ClaimReviewService(
            ClaimRepository claimRepository,
            ClaimReviewRepository reviewRepository,
            UserRepository userRepository) {

        this.claimRepository = claimRepository;
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
    }

    public ClaimReview reviewClaim(
            Long claimId,
            Long officerId,
            ClaimStatus decision,
            String remarks) {

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() ->
                        new RuntimeException("Claim not found"));

        User officer = userRepository.findById(officerId)
                .orElseThrow(() ->
                        new RuntimeException("Officer not found"));

        if (officer.getRole() != Role.OFFICER) {
            throw new RuntimeException(
                    "Only an officer can review claims");
        }

        if (decision != ClaimStatus.APPROVED
                && decision != ClaimStatus.REJECTED
                && decision != ClaimStatus.MORE_INFORMATION_REQUIRED) {

            throw new RuntimeException(
                    "Invalid review decision");
        }

        claim.setStatus(decision);
        claimRepository.save(claim);

        ClaimReview review = new ClaimReview();
        review.setClaim(claim);
        review.setOfficer(officer);
        review.setDecision(decision);
        review.setRemarks(remarks);

        return reviewRepository.save(review);
    }

    public List<ClaimReview> getReviewsByClaim(Long claimId) {

        if (!claimRepository.existsById(claimId)) {
            throw new RuntimeException("Claim not found");
        }

        return reviewRepository.findByClaimId(claimId);
    }
}