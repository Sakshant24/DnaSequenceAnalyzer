package com.dsacp.dna_analyzer.dto;

import lombok.Data;
import java.util.Map;

@Data
public class FrequencyResult {
    private Map<String, Integer> frequencies;
    private int k;
    private int totalUniqueKmers;

    public FrequencyResult(Map<String, Integer> frequencies, int k) {
        this.frequencies = frequencies;
        this.k = k;
        this.totalUniqueKmers = frequencies.size();
    }
}