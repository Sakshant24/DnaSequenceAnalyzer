package com.dsacp.dna_analyzer.dto;

import lombok.Data;

@Data
public class MutationRequest {
    private String sequenceA;
    private String sequenceB;
}