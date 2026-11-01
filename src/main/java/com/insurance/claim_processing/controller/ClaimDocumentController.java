package com.insurance.claim_processing.controller;

import com.insurance.claim_processing.entity.ClaimDocument;
import com.insurance.claim_processing.service.ClaimDocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/claims")
public class ClaimDocumentController {

    private final ClaimDocumentService documentService;

    public ClaimDocumentController(ClaimDocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/{claimId}/documents")
    public ResponseEntity<ClaimDocument> uploadDocument(
            @PathVariable Long claimId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication)
            throws IOException {

        return ResponseEntity.ok(
                documentService.uploadDocument(
                        claimId,
                        file,
                        authentication
                )
        );
    }

    @GetMapping("/{claimId}/documents")
    public ResponseEntity<List<ClaimDocument>> getDocuments(
            @PathVariable Long claimId,
            Authentication authentication) {

        return ResponseEntity.ok(
                documentService.getDocumentsByClaim(
                        claimId,
                        authentication
                )
        );
    }
}