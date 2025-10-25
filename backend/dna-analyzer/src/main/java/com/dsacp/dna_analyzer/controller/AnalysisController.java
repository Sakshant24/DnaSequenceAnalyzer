package com.dsacp.dna_analyzer.controller;

import com.dsacp.dna_analyzer.dto.FrequencyRequest;
import com.dsacp.dna_analyzer.dto.FrequencyResult;
import com.dsacp.dna_analyzer.dto.MotifRequest;
import com.dsacp.dna_analyzer.dto.MotifResult;
import com.dsacp.dna_analyzer.dto.MutationRequest;
import com.dsacp.dna_analyzer.dto.MutationResult;

import com.dsacp.dna_analyzer.service.DnaAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/analyze")
public class AnalysisController {

    @Autowired
    private DnaAnalysisService dnaService;
    /**
     * Frequency Analysis
     * POST /api/v1/analyze/frequency
     */
    @PostMapping("/frequency")
    public FrequencyResult handleFrequencyAnalysis(@RequestBody FrequencyRequest request) {
        return dnaService.analyzeFrequency(request);
    }
    /**
     * Motif Search
     * POST /api/v1/analyze/motif
     */
    @PostMapping("/motif")
    public MotifResult handleMotifSearch(@RequestBody MotifRequest request) {
        return dnaService.analyzeMotif(request);
    }
    /**
     * Mutation Detection
     * A POST request to http://localhost:8080/api/v1/analyze/mutation
     */
    @PostMapping("/mutation")
    public MutationResult handleMutationDetection(@RequestBody MutationRequest request) {
        return dnaService.analyzeMutation(request);
    }
}