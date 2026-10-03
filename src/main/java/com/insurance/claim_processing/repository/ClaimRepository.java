package com.insurance.claim_processing.repository;

import com.insurance.claim_processing.entity.Claim;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

    Optional<Claim> findByClaimNumber(String claimNumber);

    List<Claim> findByPolicyId(Long policyId);
}