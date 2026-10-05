package com.insurance.claim_processing.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "claim_analysis")
public class ClaimAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(nullable = false)
    private String claimType;

    @Column(columnDefinition = "TEXT")
    private String missingInformation;

    @Column(columnDefinition = "TEXT")
    private String riskIndicators;

    @Column(nullable = false)
    private Double confidenceScore;

    @Column(nullable = false)
    private LocalDateTime analyzedAt;

    @OneToOne
    @JoinColumn(name = "claim_id", nullable = false, unique = true)
    private Claim claim;

    public ClaimAnalysis() {
    }

    public Long getId() {
        return id;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getClaimType() {
        return claimType;
    }

    public void setClaimType(String claimType) {
        this.claimType = claimType;
    }

    public String getMissingInformation() {
        return missingInformation;
    }

    public void setMissingInformation(String missingInformation) {
        this.missingInformation = missingInformation;
    }

    public String getRiskIndicators() {
        return riskIndicators;
    }

    public void setRiskIndicators(String riskIndicators) {
        this.riskIndicators = riskIndicators;
    }

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    public LocalDateTime getAnalyzedAt() {
        return analyzedAt;
    }

    public void setAnalyzedAt(LocalDateTime analyzedAt) {
        this.analyzedAt = analyzedAt;
    }

    public Claim getClaim() {
        return claim;
    }

    public void setClaim(Claim claim) {
        this.claim = claim;
    }

    @PrePersist
    protected void onCreate() {
        analyzedAt = LocalDateTime.now();
    }
}