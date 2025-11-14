// package com.dsacp.dna_analyzer.dsa;
//
// import java.util.ArrayList;
// import java.util.Arrays;
// import java.util.Collections;
// import java.util.List;
//
// public class SuffixArray {
//   private final String text;
//   private final int[] suffixArray;
//   private final int n;
//
//   public SuffixArray(String text) {
//     this.text = text + "$";
//     this.n = this.text.length();
//     this.suffixArray = new int[n];
//     build();
//   }
//
//   private void build() {
//     Suffix[] suffixes = new Suffix[n];
//     for (int i = 0; i < n; i++) {
//       suffixes[i] = new Suffix(i, text.substring(i));
//     }
//     Arrays.sort(suffixes);
//     for (int i = 0; i < n; i++) {
//       suffixArray[i] = suffixes[i].index;
//     }
//   }
//
//   public List<Integer> search(String pattern) {
//     List<Integer> result = new ArrayList<>();
//     int patLen = pattern.length();
//     int left = findLowerBound(pattern);
//     if (left == -1) {
//       return result; // Not found
//     }
//     int right = findUpperBound(pattern);
//     for (int i = left; i <= right; i++) {
//       result.add(suffixArray[i]);
//     }
//     Collections.sort(result);
//     return result;
//   }
//
//   private int findLowerBound(String pattern) {
//     int low = 0, high = n - 1;
//     int result = -1;
//
//     while (low <= high) {
//       int mid = low + (high - low) / 2;
//       String suffix = text.substring(suffixArray[mid]);
//
//       if (suffix.startsWith(pattern)) {
//         result = mid;
//         high = mid - 1;
//       } else if (suffix.compareTo(pattern) < 0) {
//         low = mid + 1;
//       } else {
//         high = mid - 1;
//       }
//     }
//     return result;
//   }
//
//   private int findUpperBound(String pattern) {
//     int low = 0, high = n - 1;
//     int result = -1;
//
//     while (low <= high) {
//       int mid = low + (high - low) / 2;
//       String suffix = text.substring(suffixArray[mid]);
//       if (suffix.startsWith(pattern)) {
//         result = mid;
//         low = mid + 1;
//       } else if (suffix.compareTo(pattern) < 0) {
//         low = mid + 1;
//       } else {
//         high = mid - 1;
//       }
//     }
//     return result;
//   }
//
//   private static class Suffix implements Comparable<Suffix> {
//     int index;
//     String text;
//
//     Suffix(int index, String text) {
//       this.index = index;
//       this.text = text;
//     }
//
//     @Override
//     public int compareTo(Suffix other) {
//       return this.text.compareTo(other.text);
//     }
//   }
// }

package com.dsacp.dna_analyzer.dsa;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

/**
 * Suffix array with: - prefix-doubling build (O(n log n) typical) - Kasai LCP array (O(n)) -
 * substring-search (binary search) without creating substring objects
 *
 * <p>Note: this implementation appends a single 0-character sentinel '\0' to the input (guaranteed
 * smallest lexicographically) and returns match positions relative to the original input (sentinel
 * index is ignored in outputs).
 */
public class SuffixArray {
  private final String s; // original text + sentinel
  private final int n; // length of s (including sentinel)
  private final int[] sa; // suffix array: sa[i] is start index of i-th smallest suffix
  private final int[] lcp; // lcp[i] = LCP(sa[i], sa[i-1]) for i>0, lcp[0]=0

  public SuffixArray(String text) {
    // append sentinel '\0' that is lexicographically smallest
    this.s = text + '\0';
    this.n = s.length();
    this.sa = new int[n];
    this.lcp = new int[n];
    buildSA();
    buildLCP();
  }

  // -----------------------
  // Build suffix array (prefix-doubling)
  // -----------------------
  private void buildSA() {
    Integer[] order = new Integer[n];
    int[] rank = new int[n];
    int[] tmp = new int[n];

    // initial ranking by single character
    for (int i = 0; i < n; i++) {
      order[i] = i;
      rank[i] = s.charAt(i);
    }

    for (int k = 1; k < n; k <<= 1) {
      final int kk = k; // for lambda capture

      // sort indices by (rank[i], rank[i + k])
      Arrays.sort(
          order,
          new Comparator<Integer>() {
            @Override
            public int compare(Integer a, Integer b) {
              if (rank[a] != rank[b]) return Integer.compare(rank[a], rank[b]);
              int ra = (a + kk < n) ? rank[a + kk] : -1;
              int rb = (b + kk < n) ? rank[b + kk] : -1;
              return Integer.compare(ra, rb);
            }
          });

      // build temporary new ranks
      tmp[order[0]] = 0;
      for (int i = 1; i < n; i++) {
        int prev = order[i - 1];
        int cur = order[i];

        int prevFirst = rank[prev];
        int curFirst = rank[cur];
        int prevSecond = (prev + kk < n) ? rank[prev + kk] : -1;
        int curSecond = (cur + kk < n) ? rank[cur + kk] : -1;

        tmp[cur] = tmp[prev] + ((prevFirst != curFirst || prevSecond != curSecond) ? 1 : 0);
      }

      // copy tmp -> rank
      System.arraycopy(tmp, 0, rank, 0, n);

      // if all ranks are distinct (0..n-1) we are done
      if (rank[order[n - 1]] == n - 1) break;
    }

    // copy sorted order into primitive int[] sa
    for (int i = 0; i < n; i++) sa[i] = order[i];
  }

  // -----------------------
  // Kasai algorithm to build LCP array in O(n)
  // -----------------------
  private void buildLCP() {
    int[] rank = new int[n];
    for (int i = 0; i < n; i++) rank[sa[i]] = i;

    int h = 0;
    lcp[0] = 0;
    for (int i = 0; i < n; i++) {
      int r = rank[i];
      if (r == 0) { // first suffix in order: LCP undefined (0)
        lcp[r] = 0;
      } else {
        int j = sa[r - 1]; // previous suffix in SA order
        // compare s starting at i+h and j+h
        while (i + h < n && j + h < n && s.charAt(i + h) == s.charAt(j + h)) h++;
        lcp[r] = h;
        if (h > 0) h--;
      }
    }
  }

  // -----------------------
  // Public accessors
  // -----------------------

  /** Returns the suffix array (including sentinel index). */
  public int[] getSA() {
    return Arrays.copyOf(sa, sa.length);
  }

  /** Returns the LCP array (same length as SA). lcp[0] = 0. */
  public int[] getLCP() {
    return Arrays.copyOf(lcp, lcp.length);
  }

  // -----------------------
  // Search: find all occurrences of pattern in original text (no substrings created)
  // -----------------------
  public List<Integer> search(String pattern) {
    List<Integer> res = new ArrayList<>();
    if (pattern == null || pattern.length() == 0) return res;

    int left = lowerBound(pattern);
    if (left == -1) return res; // no match
    int right = upperBound(pattern);

    // collect sa[i] positions but ignore sentinel position (which equals original length)
    int originalLen = n - 1; // original text length before sentinel
    for (int i = left; i <= right; i++) {
      int pos = sa[i];
      if (pos < originalLen) res.add(pos);
    }
    // results are already in lex-order of suffixes; to return in increasing text index:
    res.sort(Integer::compareTo);
    return res;
  }

  // compare suffix at index 'pos' with the pattern:
  // returns:
  //   0  if pattern is prefix of suffix (i.e., suffix startsWith pattern)
  //  <0  if suffix < pattern (lexicographically)
  //  >0  if suffix > pattern
  private int compareSuffixToPattern(int pos, String pattern) {
    int m = pattern.length();
    int i = 0;
    while (i < m && pos + i < n) {
      char sc = s.charAt(pos + i);
      char pc = pattern.charAt(i);
      if (sc != pc) return sc - pc;
      i++;
    }
    if (i == m) return 0; // pattern exhausted -> pattern is prefix of suffix
    // suffix ended before pattern (shouldn't happen because sentinel exists),
    // but if it does: suffix < pattern
    return -1;
  }

  // find first SA index whose suffix starts with pattern; return -1 if none
  private int lowerBound(String pattern) {
    int low = 0, high = n - 1, ans = -1;
    while (low <= high) {
      int mid = (low + high) >>> 1;
      int cmp = compareSuffixToPattern(sa[mid], pattern);
      if (cmp == 0) {
        ans = mid;
        high = mid - 1; // continue left to find first
      } else if (cmp < 0) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return ans;
  }

  // find last SA index whose suffix starts with pattern; return -1 if none
  private int upperBound(String pattern) {
    int low = 0, high = n - 1, ans = -1;
    while (low <= high) {
      int mid = (low + high) >>> 1;
      int cmp = compareSuffixToPattern(sa[mid], pattern);
      if (cmp == 0) {
        ans = mid;
        low = mid + 1; // continue right to find last
      } else if (cmp < 0) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return ans;
  }
}

