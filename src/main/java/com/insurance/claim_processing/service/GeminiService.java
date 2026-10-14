package com.insurance.claim_processing.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final Client client;

    public GeminiService() {
        String apiKey = System.getenv("GEMINI_API_KEY");

        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException(
                    "GEMINI_API_KEY environment variable is not set"
            );
        }

        this.client = Client.builder()
                .apiKey(apiKey)
                .build();
    }

    public String analyzeClaim(String claimText) {

        String prompt = """
                You are an AI assistant for an insurance claim processing system.

                Analyze the following insurance claim information.

                Provide the response in this exact structure:

                CLAIM TYPE:
                SUMMARY:
                MISSING INFORMATION:
                RISK INDICATORS:
                CONFIDENCE SCORE:

                Rules:
                - Identify the likely type of insurance claim.
                - Summarize the claim clearly.
                - Identify documents or information that appear to be missing.
                - Identify suspicious, inconsistent, or unusual information.
                - Give a confidence score between 0 and 1.
                - Do not make the final approval or rejection decision.
                - The final decision must be made by an insurance officer.

                CLAIM INFORMATION:
                """ + claimText;

        GenerateContentResponse response =
                client.models.generateContent(
                        "gemini-3.5-flash-lite",
                        prompt,
                        null
                );

        return response.text();
    }
}