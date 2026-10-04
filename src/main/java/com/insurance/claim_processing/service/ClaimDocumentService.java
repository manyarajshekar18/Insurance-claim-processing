package com.insurance.claim_processing.service;

import com.insurance.claim_processing.entity.Claim;
import com.insurance.claim_processing.entity.ClaimDocument;
import com.insurance.claim_processing.repository.ClaimDocumentRepository;
import com.insurance.claim_processing.repository.ClaimRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class ClaimDocumentService {

    private final ClaimDocumentRepository documentRepository;
    private final ClaimRepository claimRepository;

    private final Path uploadDirectory =
            Paths.get("uploads/claims");

    public ClaimDocumentService(
            ClaimDocumentRepository documentRepository,
            ClaimRepository claimRepository) {
        this.documentRepository = documentRepository;
        this.claimRepository = claimRepository;
    }

    public ClaimDocument uploadDocument(
            Long claimId,
            MultipartFile file) throws IOException {

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        Files.createDirectories(uploadDirectory);

        String fileName = System.currentTimeMillis()
                + "_" + file.getOriginalFilename();

        Path filePath = uploadDirectory.resolve(fileName);

        Files.copy(file.getInputStream(), filePath);

        ClaimDocument document = new ClaimDocument();
        document.setFileName(file.getOriginalFilename());
        document.setFileType(file.getContentType());
        document.setFilePath(filePath.toString());
        document.setClaim(claim);

        return documentRepository.save(document);
    }

    public List<ClaimDocument> getDocumentsByClaim(Long claimId) {
        return documentRepository.findByClaimId(claimId);
    }
}