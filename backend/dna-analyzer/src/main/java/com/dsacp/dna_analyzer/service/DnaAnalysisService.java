package com.dsacp.dna_analyzer.service;

import com.dsacp.dna_analyzer.dsa.FrequencyAnalyzer;
import com.dsacp.dna_analyzer.dto.FrequencyRequest;
import com.dsacp.dna_analyzer.dto.FrequencyResult;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class DnaAnalysisService {
    private final FrequencyAnalyzer frequencyAnalyzer = new FrequencyAnalyzer();
    public FrequencyResult analyzeFrequency(FrequencyRequest request) {
        String dna = request.getDnaSequence();
        int k = request.getK();

        Map<String, Integer> counts = frequencyAnalyzer.calculateFrequency(dna, k);

        return new FrequencyResult(counts, k);
    }
}