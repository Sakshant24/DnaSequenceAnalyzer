package com.dsacp.dna_analyzer.dto;

import lombok.Data;

@Data
public class MutationResult {
    private String sequenceA;
    private String sequenceB;
    private int editDistance;
    private String mutationClassification;

    public MutationResult(String sequenceA, String sequenceB, int distance) {
        this.sequenceA = sequenceA;
        this.sequenceB = sequenceB;
        this.editDistance = distance;
        if (distance == 0) {
            this.mutationClassification = "Identical";
        } else if (distance <= 5) {
            this.mutationClassification = "Similar (Low Mutation)";
        } else if (distance <= 8) {
            this.mutationClassification = "Different (Medium Mutation)";
        } else {
            this.mutationClassification = "Highly Different (High Mutation)";
        }
    }
}