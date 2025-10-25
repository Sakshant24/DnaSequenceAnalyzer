package com.dsacp.dna_analyzer.dsa;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class SuffixArray {
    private final String text;
    private final int[] suffixArray;
    private final int n;

    public SuffixArray(String text) {
        this.text = text + "$";
        this.n = this.text.length();
        this.suffixArray = new int[n];
        build();
    }
    private void build() {
        Suffix[] suffixes = new Suffix[n];
        for (int i = 0; i < n; i++) {
            suffixes[i] = new Suffix(i, text.substring(i));
        }
        Arrays.sort(suffixes);
        for (int i = 0; i < n; i++) {
            suffixArray[i] = suffixes[i].index;
        }
    }
    public List<Integer> search(String pattern) {
        List<Integer> result = new ArrayList<>();
        int patLen = pattern.length();
        int left = findLowerBound(pattern);
        if (left == -1) {
            return result; // Not found
        }
        int right = findUpperBound(pattern);
        for (int i = left; i <= right; i++) {
            result.add(suffixArray[i]);
        }
        Collections.sort(result);
        return result;
    }
    private int findLowerBound(String pattern) {
        int low = 0, high = n - 1;
        int result = -1;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            String suffix = text.substring(suffixArray[mid]);

            if (suffix.startsWith(pattern)) {
                result = mid;
                high = mid - 1;
            } else if (suffix.compareTo(pattern) < 0) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return result;
    }
    private int findUpperBound(String pattern) {
        int low = 0, high = n - 1;
        int result = -1;

        while (low <= high) {
            int mid = low + (high - low) / 2;
            String suffix = text.substring(suffixArray[mid]);
            if (suffix.startsWith(pattern)) {
                result = mid;
                low = mid + 1;
            } else if (suffix.compareTo(pattern) < 0) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return result;
    }
    private static class Suffix implements Comparable<Suffix> {
        int index;
        String text;
        Suffix(int index, String text) {
            this.index = index;
            this.text = text;
        }
        @Override
        public int compareTo(Suffix other) {
            return this.text.compareTo(other.text);
        }
    }
}