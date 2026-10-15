package com.insurance.claim_processing.controller;

import com.insurance.claim_processing.entity.ClaimReview;
import com.insurance.claim_processing.entity.ClaimStatus;
import com.insurance.claim_processing.entity.User;
import com.insurance.claim_processing.service.ClaimReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimReviewController {

    private final ClaimReviewService reviewService;

    public ClaimReviewController(ClaimReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/{claimId}/review")
    public ResponseEntity<ClaimReview> reviewClaim(
            @PathVariable Long claimId,
            @RequestParam ClaimStatus decision,
            @RequestParam(required = false) String remarks,
            Authentication authentication) {

        User officer = (User) authentication.getPrincipal();

        ClaimReview review = reviewService.reviewClaim(
                claimId,
                officer.getId(),
                decision,
                remarks
        );

        return ResponseEntity.ok(review);
    }

    @GetMapping("/{claimId}/reviews")
    public ResponseEntity<List<ClaimReview>> getReviews(
            @PathVariable Long claimId) {

        return ResponseEntity.ok(
                reviewService.getReviewsByClaim(claimId)
        );
    }
}