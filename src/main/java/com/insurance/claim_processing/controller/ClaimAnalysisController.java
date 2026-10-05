package com.insurance.claim_processing.controller;

import com.insurance.claim_processing.entity.ClaimAnalysis;
import com.insurance.claim_processing.service.ClaimAnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/claims")
public class ClaimAnalysisController {

    private final ClaimAnalysisService analysisService;

    public ClaimAnalysisController(
            ClaimAnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @PostMapping("/{claimId}/analyze")
    public ResponseEntity<ClaimAnalysis> analyzeClaim(
            @PathVariable Long claimId) {

        return ResponseEntity.ok(
                analysisService.analyzeClaim(claimId)
        );
    }

    @GetMapping("/{claimId}/analysis")
    public ResponseEntity<ClaimAnalysis> getAnalysis(
            @PathVariable Long claimId) {

        return ResponseEntity.ok(
                analysisService.getAnalysis(claimId)
        );
    }
}