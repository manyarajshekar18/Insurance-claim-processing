package com.insurance.claim_processing.service;

import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

@Service
public class OcrService {

    public String extractText(String filePath) throws IOException {

        Path path = Path.of(filePath);

        if (!Files.exists(path)) {
            throw new RuntimeException("File not found");
        }

        byte[] fileBytes = Files.readAllBytes(path);

        return new String(fileBytes, StandardCharsets.UTF_8);
    }
}