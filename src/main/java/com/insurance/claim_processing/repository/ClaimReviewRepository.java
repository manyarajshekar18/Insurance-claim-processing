package com.insurance.claim_processing.repository;

import com.insurance.claim_processing.entity.ClaimReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClaimReviewRepository
        extends JpaRepository<ClaimReview, Long> {

    List<ClaimReview> findByClaimId(Long claimId);
}