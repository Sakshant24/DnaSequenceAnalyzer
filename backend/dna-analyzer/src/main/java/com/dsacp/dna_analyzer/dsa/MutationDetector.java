package com.dsacp.dna_analyzer.dsa;

public class MutationDetector {
  public int calculateEditDistance(String strA, String strB) {
    if (strA == null) strA = "";
    if (strB == null) strB = "";

    int lenA = strA.length();
    int lenB = strB.length();

    int[][] dp = new int[lenA + 1][lenB + 1];
    for (int i = 0; i <= lenA; i++) {
      for (int j = 0; j <= lenB; j++) {
        if (i == 0) {
          dp[i][j] = j;
        } else if (j == 0) {
          dp[i][j] = i;
        } else if (strA.charAt(i - 1) == strB.charAt(j - 1)) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          int insert = dp[i][j - 1];
          int delete = dp[i - 1][j];
          int replace = dp[i - 1][j - 1];
          dp[i][j] = 1 + Math.min(insert, Math.min(delete, replace));
        }
      }
    }
    return dp[lenA][lenB];
  }
}

