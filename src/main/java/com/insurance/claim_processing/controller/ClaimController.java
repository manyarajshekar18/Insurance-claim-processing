package com.insurance.claim_processing.controller;

import com.insurance.claim_processing.entity.Claim;
import com.insurance.claim_processing.service.ClaimService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping
    public ResponseEntity<Claim> createClaim(
            @RequestParam String claimNumber,
            @RequestParam String description,
            @RequestParam Double claimAmount,
            @RequestParam Long policyId) {

        Claim claim = claimService.createClaim(
                claimNumber,
                description,
                claimAmount,
                policyId
        );

        return ResponseEntity.ok(claim);
    }

    @GetMapping("/policy/{policyId}")
    public ResponseEntity<List<Claim>> getClaimsByPolicy(
            @PathVariable Long policyId) {

        return ResponseEntity.ok(
                claimService.getClaimsByPolicy(policyId)
        );
    }
}