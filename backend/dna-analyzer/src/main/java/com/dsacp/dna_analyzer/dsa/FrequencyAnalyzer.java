package com.dsacp.dna_analyzer.dsa;

import java.util.HashMap;
import java.util.Map;

public class FrequencyAnalyzer {
    public Map<String, Integer> calculateFrequency(String dna, int k) {
        if (dna == null || dna.length() < k || k <= 0) {
            return new HashMap<>();
        }
        Map<String, Integer> frequencyMap = new HashMap<>();
        for (int i = 0; i <= dna.length() - k; i++) {
            String kmer = dna.substring(i, i + k);
            frequencyMap.put(kmer, frequencyMap.getOrDefault(kmer, 0) + 1);
        }
        return frequencyMap;
    }
}