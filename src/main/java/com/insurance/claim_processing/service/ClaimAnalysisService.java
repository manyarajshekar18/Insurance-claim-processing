package com.insurance.claim_processing.service;

import com.insurance.claim_processing.entity.Claim;
import com.insurance.claim_processing.entity.ClaimAnalysis;
import com.insurance.claim_processing.entity.ClaimDocument;
import com.insurance.claim_processing.repository.ClaimAnalysisRepository;
import com.insurance.claim_processing.repository.ClaimDocumentRepository;
import com.insurance.claim_processing.repository.ClaimRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ClaimAnalysisService {

    private final ClaimRepository claimRepository;
    private final ClaimDocumentRepository documentRepository;
    private final ClaimAnalysisRepository analysisRepository;
    private final GeminiService geminiService;

    public ClaimAnalysisService(
            ClaimRepository claimRepository,
            ClaimDocumentRepository documentRepository,
            ClaimAnalysisRepository analysisRepository,
            GeminiService geminiService) {

        this.claimRepository = claimRepository;
        this.documentRepository = documentRepository;
        this.analysisRepository = analysisRepository;
        this.geminiService = geminiService;
    }

    public ClaimAnalysis analyzeClaim(Long claimId) {

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() ->
                        new RuntimeException("Claim not found"));

        List<ClaimDocument> documents =
                documentRepository.findByClaimId(claimId);

        if (documents.isEmpty()) {
            throw new RuntimeException(
                    "No documents found for this claim");
        }

        StringBuilder claimText = new StringBuilder();

        claimText.append("Claim ID: ")
                .append(claim.getClaimNumber())
                .append("\n");

        claimText.append("Claim Description: ")
                .append(claim.getDescription())
                .append("\n");

        claimText.append("Claim Amount: ")
                .append(claim.getClaimAmount())
                .append("\n");

        for (ClaimDocument document : documents) {

            if (document.getExtractedText() != null &&
                    !document.getExtractedText().isBlank()) {

                claimText.append("\nDocument: ")
                        .append(document.getFileName())
                        .append("\n");

                claimText.append(
                        document.getExtractedText()
                ).append("\n");
            }
        }

        String aiResponse =
                geminiService.analyzeClaim(
                        claimText.toString()
                );

        ClaimAnalysis analysis =
                analysisRepository.findByClaimId(claimId)
                        .orElse(new ClaimAnalysis());

        analysis.setClaim(claim);

        analysis.setSummary(aiResponse);

        analysis.setClaimType(
                extractValue(aiResponse, "CLAIM TYPE:")
        );

        analysis.setMissingInformation(
                extractSection(
                        aiResponse,
                        "MISSING INFORMATION:",
                        "RISK INDICATORS:"
                )
        );

        analysis.setRiskIndicators(
                extractSection(
                        aiResponse,
                        "RISK INDICATORS:",
                        "CONFIDENCE SCORE:"
                )
        );

        analysis.setConfidenceScore(
                extractConfidenceScore(aiResponse)
        );

        return analysisRepository.save(analysis);
    }

    public ClaimAnalysis getAnalysis(Long claimId) {

        return analysisRepository.findByClaimId(claimId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Analysis not found for this claim"
                        ));
    }

    private String extractValue(
            String text,
            String label) {

        Pattern pattern = Pattern.compile(
                Pattern.quote(label) + "\\s*(.+?)(?:\\r?\\n|$)",
                Pattern.CASE_INSENSITIVE
        );

        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            return matcher.group(1).trim();
        }

        return "UNKNOWN";
    }

    private String extractSection(
            String text,
            String startLabel,
            String endLabel) {

        int start = text.indexOf(startLabel);

        if (start == -1) {
            return "Not provided";
        }

        start += startLabel.length();

        int end = text.indexOf(endLabel, start);

        if (end == -1) {
            end = text.length();
        }

        return text.substring(start, end).trim();
    }

    private Double extractConfidenceScore(String text) {

        Pattern pattern = Pattern.compile(
                "CONFIDENCE SCORE:\\s*([0-9]*\\.?[0-9]+)",
                Pattern.CASE_INSENSITIVE
        );

        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            try {
                double score =
                        Double.parseDouble(matcher.group(1));

                return Math.max(0.0, Math.min(1.0, score));

            } catch (NumberFormatException ignored) {
                return 0.0;
            }
        }

        return 0.0;
    }
}