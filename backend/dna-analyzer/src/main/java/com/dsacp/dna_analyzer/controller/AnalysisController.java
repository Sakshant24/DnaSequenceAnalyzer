package com.dsacp.dna_analyzer.controller;

import com.dsacp.dna_analyzer.dto.FrequencyRequest;
import com.dsacp.dna_analyzer.dto.FrequencyResult;
import com.dsacp.dna_analyzer.service.DnaAnalysisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/analyze")
public class AnalysisController {
    @Autowired
    private DnaAnalysisService dnaService;

    /**
     * This method creates our first API endpoint:
     * A POST request to http://localhost:8080/api/v1/analyze/frequency
     * * @RequestBody tells Spring to turn the incoming JSON
     * into a FrequencyRequest object.
     */
    @PostMapping("/frequency")
    public FrequencyResult handleFrequencyAnalysis(@RequestBody FrequencyRequest request) {
        return dnaService.analyzeFrequency(request);
    }
}