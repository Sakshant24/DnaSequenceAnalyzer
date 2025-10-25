package com.dsacp.dna_analyzer.dto;

import lombok.Data;

@Data
public class MotifRequest {
    private String dnaSequence;
    private String motif;
}