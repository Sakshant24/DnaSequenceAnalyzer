package com.dsacp.dna_analyzer.dsa;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

// public class FrequencyAnalyzer {
//     public Map<String, Integer> calculateFrequency(String dna, int k) {
//         if (dna == null || dna.length() < k || k <= 0) {
//             return new HashMap<>();
//         }
//         Map<String, Integer> frequencyMap = new HashMap<>();
//         for (int i = 0; i <= dna.length() - k; i++) {
//             String kmer = dna.substring(i, i + k);
//             frequencyMap.put(kmer, frequencyMap.getOrDefault(kmer, 0) + 1);
//         }
//         return frequencyMap;
//     }
// }
//

public class FrequencyAnalyzer {

  // --- Custom Entry Class (for the linked list nodes) ---
  private static class CustomEntry {
    final String key;
    long value;

    CustomEntry(String key, long value) {
      this.key = key;
      this.value = value;
    }
  }

  // --- Custom Simple Map Implementation (built from scratch) ---
  // NOTE: This class replaces the functionality of java.util.HashMap
  private static class CustomSimpleMap {
    private static final int DEFAULT_CAPACITY = 100;
    // The backing array of linked lists (buckets)
    private final List<CustomEntry>[] table;

    @SuppressWarnings("unchecked")
    public CustomSimpleMap() {
      // Initialize the array of LinkedLists
      this.table = new LinkedList[DEFAULT_CAPACITY];
      for (int i = 0; i < DEFAULT_CAPACITY; i++) {
        // Uses LinkedList, a fundamental list implementation
        table[i] = new LinkedList<>();
      }
    }

    /**
     * Custom simple hash function: Sums up character values. IMPORTANT: This avoids using
     * String.hashCode().
     */
    private int getBucketIndex(String key) {
      int hash = 0;
      // Simple summation of character values
      for (char c : key.toCharArray()) {
        hash += c;
      }
      // Modulo by capacity to get the bucket index
      return Math.abs(hash) % DEFAULT_CAPACITY;
    }

    /** Puts a key-value pair, updating the value if the key already exists. */
    public void put(String key, long value) {
      int index = getBucketIndex(key);
      List<CustomEntry> bucket = table[index];

      // 1. Search for an existing key (collision handling)
      for (CustomEntry entry : bucket) {
        if (entry.key.equals(key)) {
          entry.value = value; // Update existing value
          return;
        }
      }
      // 2. Key not found, add a new entry to the bucket
      bucket.add(new CustomEntry(key, value));
    }

    /** Retrieves the value for a key or returns a default value if not found. */
    public long getOrDefault(String key, long defaultValue) {
      int index = getBucketIndex(key);
      List<CustomEntry> bucket = table[index];

      // Search for the key in the bucket
      for (CustomEntry entry : bucket) {
        if (entry.key.equals(key)) {
          return entry.value;
        }
      }
      // Key not found
      return defaultValue;
    }

    /** Converts the custom map structure into a normal Java Map. */
    public Map<String, Integer> toStandardMap() {
      Map<String, Integer> map = new HashMap<>();
      for (List<CustomEntry> bucket : table) {
        for (CustomEntry entry : bucket) {
          map.put(entry.key, (int) entry.value);
        }
      }
      return map;
    }

    // You could add a simple display/toString method here for testing
    // or a method to retrieve all entries if needed.
  }

  // --- Original Function Reimlemented using the Custom Map ---
  /**
   * Analyzes K-mer frequency using a custom-built hash map structure. NOTE: The return type is now
   * the custom map class itself, as java.util.Map cannot be used without importing it.
   */
  public Map<String, Integer> calculateFrequency(String dnaSequence, int k) {

    // Use the custom map
    CustomSimpleMap frequencyMap = new CustomSimpleMap();
    int n = dnaSequence.length();

    // Single traversal of the sequence (O(n) time)
    for (int i = 0; i <= n - k; i++) {
      String kmer = dnaSequence.substring(i, i + k);

      // Core logic: Update the frequency using the custom map's methods
      frequencyMap.put(kmer, frequencyMap.getOrDefault(kmer, 0L) + 1);
    }

    return frequencyMap.toStandardMap();
  }
}

