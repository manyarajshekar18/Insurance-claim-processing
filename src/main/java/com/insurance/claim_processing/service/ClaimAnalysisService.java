package com.insurance.claim_processing.service;

import com.insurance.claim_processing.entity.Claim;
import com.insurance.claim_processing.entity.ClaimAnalysis;
import com.insurance.claim_processing.entity.ClaimDocument;
import com.insurance.claim_processing.repository.ClaimAnalysisRepository;
import com.insurance.claim_processing.repository.ClaimDocumentRepository;
import com.insurance.claim_processing.repository.ClaimRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClaimAnalysisService {

    private final ClaimRepository claimRepository;
    private final ClaimDocumentRepository documentRepository;
    private final ClaimAnalysisRepository analysisRepository;

    public ClaimAnalysisService(
            ClaimRepository claimRepository,
            ClaimDocumentRepository documentRepository,
            ClaimAnalysisRepository analysisRepository) {

        this.claimRepository = claimRepository;
        this.documentRepository = documentRepository;
        this.analysisRepository = analysisRepository;
    }

    public ClaimAnalysis analyzeClaim(Long claimId) {

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        List<ClaimDocument> documents =
                documentRepository.findByClaimId(claimId);

        if (documents.isEmpty()) {
            throw new RuntimeException("No documents found for this claim");
        }

        StringBuilder extractedText = new StringBuilder();

        for (ClaimDocument document : documents) {
            if (document.getExtractedText() != null) {
                extractedText
                        .append(document.getExtractedText())
                        .append("\n");
            }
        }

        if (extractedText.isEmpty()) {
            throw new RuntimeException("No extracted text found");
        }

        ClaimAnalysis analysis = new ClaimAnalysis();

        analysis.setClaim(claim);
        analysis.setSummary(
                "The customer submitted a hospitalization claim " +
                "with a claim amount of " + claim.getClaimAmount() +
                ". Document text was successfully extracted for analysis."
        );

        analysis.setClaimType("HEALTH / HOSPITALIZATION");

        analysis.setMissingInformation(
                "No missing information detected at this stage."
        );

        analysis.setRiskIndicators(
                "No immediate risk indicators detected. " +
                "Further AI analysis is required for final assessment."
        );

        analysis.setConfidenceScore(0.85);

        return analysisRepository.save(analysis);
    }

    public ClaimAnalysis getAnalysis(Long claimId) {

        return analysisRepository.findByClaimId(claimId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Analysis not found for this claim"
                        ));
    }
}