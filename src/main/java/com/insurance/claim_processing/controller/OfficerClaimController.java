package com.insurance.claim_processing.controller;

import com.insurance.claim_processing.entity.Claim;
import com.insurance.claim_processing.service.OfficerClaimService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/officer")
public class OfficerClaimController {

    private final OfficerClaimService officerClaimService;

    public OfficerClaimController(
            OfficerClaimService officerClaimService) {
        this.officerClaimService = officerClaimService;
    }

    @GetMapping("/claims")
    public ResponseEntity<List<Claim>> getPendingClaims() {

        return ResponseEntity.ok(
                officerClaimService.getPendingClaims()
        );
    }
}