package com.dsacp.dna_analyzer.dto;

import lombok.Data;

@Data
public class FrequencyRequest {
    private String dnaSequence;
    private int k;
}