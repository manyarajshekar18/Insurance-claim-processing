package com.insurance.claim_processing.repository;

import com.insurance.claim_processing.entity.ClaimAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClaimAnalysisRepository
        extends JpaRepository<ClaimAnalysis, Long> {

    Optional<ClaimAnalysis> findByClaimId(Long claimId);
}