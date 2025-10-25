package com.dsacp.dna_analyzer.service;

import com.dsacp.dna_analyzer.dsa.FrequencyAnalyzer;
import com.dsacp.dna_analyzer.dsa.MutationDetector;
import com.dsacp.dna_analyzer.dsa.SuffixArray;
import com.dsacp.dna_analyzer.dto.FrequencyRequest;
import com.dsacp.dna_analyzer.dto.FrequencyResult;
import com.dsacp.dna_analyzer.dto.MotifRequest;
import com.dsacp.dna_analyzer.dto.MotifResult;
import com.dsacp.dna_analyzer.dto.MutationRequest;
import com.dsacp.dna_analyzer.dto.MutationResult;
import org.springframework.stereotype.Service;
import java.util.List;
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

    public MotifResult analyzeMotif(MotifRequest request) {
        String dna = request.getDnaSequence();
        String motif = request.getMotif();
        SuffixArray suffixArray = new SuffixArray(dna);
        List<Integer> locations = suffixArray.search(motif);
        return new MotifResult(motif, locations);
    }

    private final MutationDetector mutationDetector = new MutationDetector();

    public MutationResult analyzeMutation(MutationRequest request) {
        String seqA = request.getSequenceA();
        String seqB = request.getSequenceB();
        int distance = mutationDetector.calculateEditDistance(seqA, seqB);
        return new MutationResult(seqA, seqB, distance);
    }
}