package com.insurance.claim_processing.controller;

import com.insurance.claim_processing.entity.ClaimAnalysis;
import com.insurance.claim_processing.service.ClaimAnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/claims")
public class ClaimAnalysisController {

    private final ClaimAnalysisService analysisService;

    public ClaimAnalysisController(
            ClaimAnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @PostMapping("/{claimId}/analyze")
    public ResponseEntity<Map<String, Object>> analyzeClaim(
            @PathVariable Long claimId) {

        ClaimAnalysis analysis =
                analysisService.analyzeClaim(claimId);

        return ResponseEntity.ok(buildResponse(analysis));
    }

    @GetMapping("/{claimId}/analysis")
    public ResponseEntity<Map<String, Object>> getAnalysis(
            @PathVariable Long claimId) {

        ClaimAnalysis analysis =
                analysisService.getAnalysis(claimId);

        return ResponseEntity.ok(buildResponse(analysis));
    }

    private Map<String, Object> buildResponse(ClaimAnalysis analysis) {

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("id", analysis.getId());
        response.put("claimType", analysis.getClaimType());
        response.put("summary", analysis.getSummary());
        response.put("missingInformation",
                analysis.getMissingInformation());
        response.put("riskIndicators",
                analysis.getRiskIndicators());
        response.put("confidenceScore",
                analysis.getConfidenceScore());
        response.put("analyzedAt",
                analysis.getAnalyzedAt());

        return response;
    }
}