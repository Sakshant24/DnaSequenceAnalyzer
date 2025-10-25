package com.dsacp.dna_analyzer.dto;

import lombok.Data;
import java.util.List;

@Data
public class MotifResult {
    private String motifSearched;
    private List<Integer> locationsFound;
    private int totalOccurrences;
    public MotifResult(String motif, List<Integer> locations) {
        this.motifSearched = motif;
        this.locationsFound = locations;
        this.totalOccurrences = locations.size();
    }
}