import React, { useState } from 'react';
import { dnaAnalysisService } from '../services/api';
import Visualization from './Visualization';

const FrequencyAnalysis = ({ dnaSequence }) => {
    const [kValue, setKValue] = useState(3);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!dnaSequence.trim()) {
            setError('Please provide a DNA sequence first');
            return;
        }
        if (kValue < 1 || kValue > 10) {
            setError('K value must be between 1 and 10');
            return;
        }
        setLoading(true);
        setError('');
        setResults(null);
        try {
            const analysisResults = await dnaAnalysisService.analyzeFrequency(dnaSequence, kValue);
            setResults(analysisResults);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card">
            <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>🧬 Gene Frequency Analysis</h2>

            <div className="form-group">
                <label className="form-label">K-mer Length (1-10):</label>
                <input
                    type="number"
                    min="1"
                    max="10"
                    value={kValue}
                    onChange={(e) => setKValue(parseInt(e.target.value))}
                    className="form-input"
                    style={{ maxWidth: '200px' }}
                />
                <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>
                    K-mer length determines the size of DNA subsequences to analyze
                </small>
            </div>

            <button
                onClick={handleAnalyze}
                disabled={loading || !dnaSequence}
                className="btn"
            >
                {loading ? <div className="loading"></div> : '🔍'}
                {loading ? ' Analyzing...' : ' Analyze Frequency'}
            </button>

            {error && <div className="error-message">{error}</div>}

            {results && (
                <div className="results-container">
                    <h3 style={{ color: '#333', marginBottom: '1rem' }}>Analysis Results</h3>
                    <div style={resultsSummaryStyle}>
                        <p><strong>K-value:</strong> {results.k}</p>
                        <p><strong>Total Unique K-mers:</strong> {results.totalUniqueKmers}</p>
                        <p><strong>Sequence Length:</strong> {dnaSequence.length} characters</p>
                    </div>

                    {/* Visualization */}
                    <Visualization data={results.frequencies} type="frequency" />

                    {/* Results Table */}
                    <div style={{ marginTop: '2rem' }}>
                        <h4 style={{ marginBottom: '1rem' }}>K-mer Frequencies</h4>
                        <div style={tableContainerStyle}>
                            <table style={tableStyle}>
                                <thead>
                                <tr>
                                    <th style={thStyle}>K-mer</th>
                                    <th style={thStyle}>Frequency</th>
                                </tr>
                                </thead>
                                <tbody>
                                {Object.entries(results.frequencies)
                                    .sort(([,a], [,b]) => b - a)
                                    .slice(0, 20) // Show top 20
                                    .map(([kmer, frequency]) => (
                                        <tr key={kmer}>
                                            <td style={tdStyle}><code>{kmer}</code></td>
                                            <td style={tdStyle}>{frequency}</td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                        </div>
                        {Object.keys(results.frequencies).length > 20 && (
                            <p style={{ textAlign: 'center', color: '#666', marginTop: '1rem' }}>
                                Showing top 20 k-mers out of {results.totalUniqueKmers} total
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const resultsSummaryStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
    padding: '1rem',
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #e1e5e9'
};

const tableContainerStyle = {
    maxHeight: '400px',
    overflowY: 'auto',
    border: '1px solid #e1e5e9',
    borderRadius: '8px'
};

const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
};

const thStyle = {
    padding: '1rem',
    background: '#f8f9fa',
    borderBottom: '2px solid #e1e5e9',
    textAlign: 'left',
    fontWeight: '600',
    position: 'sticky',
    top: 0
};

const tdStyle = {
    padding: '1rem',
    borderBottom: '1px solid #e1e5e9'
};

export default FrequencyAnalysis;