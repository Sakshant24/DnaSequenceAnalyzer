import React, { useState } from 'react';
import { dnaAnalysisService } from '../services/api';
import FileUpload from './FileUpload';

const MutationDetection = () => {
    const [sequenceA, setSequenceA] = useState('');
    const [sequenceB, setSequenceB] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async () => {
        if (!sequenceA.trim() || !sequenceB.trim()) {
            setError('Please provide both DNA sequences');
            return;
        }

        setLoading(true);
        setError('');
        setResults(null);

        try {
            const analysisResults = await dnaAnalysisService.analyzeMutation(sequenceA, sequenceB);
            setResults(analysisResults);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getMutationColor = (classification) => {
        switch (classification) {
            case 'Identical': return '#28a745';
            case 'Similar (Low Mutation)': return '#ffc107';
            case 'Different (Medium Mutation)': return '#fd7e14';
            case 'Highly Different (High Mutation)': return '#dc3545';
            default: return '#6c757d';
        }
    };

    return (
        <div>
            <div className="card">
                <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>🔄 Mutation Detection</h2>

                <div style={sequencesContainerStyle}>
                    <div style={sequenceColumnStyle}>
                        <FileUpload
                            title="Reference Sequence (Sequence A)"
                            onFileRead={setSequenceA}
                            currentSequence={sequenceA}
                            isSecondSequence={true}
                        />
                        {sequenceA && (
                            <div style={sequencePreviewStyle}>
                                <strong>Sequence A Preview:</strong>
                                <pre style={previewTextStyle}>
                  {sequenceA.length > 100 ? sequenceA.substring(0, 100) + '...' : sequenceA}
                </pre>
                                <small>Length: {sequenceA.length} characters</small>
                            </div>
                        )}
                    </div>

                    <div style={sequenceColumnStyle}>
                        <FileUpload
                            title="Sample Sequence (Sequence B)"
                            onFileRead={setSequenceB}
                            currentSequence={sequenceB}
                            isSecondSequence={true}
                        />
                        {sequenceB && (
                            <div style={sequencePreviewStyle}>
                                <strong>Sequence B Preview:</strong>
                                <pre style={previewTextStyle}>
                  {sequenceB.length > 100 ? sequenceB.substring(0, 100) + '...' : sequenceB}
                </pre>
                                <small>Length: {sequenceB.length} characters</small>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleAnalyze}
                    disabled={loading || !sequenceA || !sequenceB}
                    className="btn"
                    style={{ marginTop: '1.5rem' }}
                >
                    {loading ? <div className="loading"></div> : '🧬'}
                    {loading ? ' Detecting Mutations...' : ' Detect Mutations'}
                </button>

                {error && <div className="error-message" style={{ marginTop: '1rem' }}>{error}</div>}
            </div>

            {results && (
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Mutation Analysis Results</h3>

                    <div style={mutationResultsStyle}>
                        <div style={resultCardStyle}>
                            <h4 style={{ color: '#333', marginBottom: '1rem' }}>Edit Distance Analysis</h4>

                            <div style={metricGridStyle}>
                                <div style={metricStyle}>
                                    <span style={metricLabelStyle}>Edit Distance</span>
                                    <span style={metricValueStyle}>{results.editDistance}</span>
                                </div>

                                <div style={metricStyle}>
                                    <span style={metricLabelStyle}>Classification</span>
                                    <span
                                        style={{
                                            ...metricValueStyle,
                                            color: getMutationColor(results.mutationClassification),
                                            fontWeight: 'bold'
                                        }}
                                    >
                    {results.mutationClassification}
                  </span>
                                </div>
                            </div>

                            <div style={interpretationStyle}>
                                <h5>Interpretation:</h5>
                                <p>
                                    The edit distance of <strong>{results.editDistance}</strong> represents the minimum number
                                    of single-character edits (insertions, deletions, or substitutions) required to transform
                                    Sequence A into Sequence B.
                                </p>
                                {results.editDistance === 0 && (
                                    <p style={identicalStyle}>✅ The sequences are identical - no mutations detected.</p>
                                )}
                                {results.editDistance > 0 && results.editDistance <= 5 && (
                                    <p style={lowMutationStyle}>🟡 Low mutation level - sequences are very similar.</p>
                                )}
                                {results.editDistance > 5 && results.editDistance <= 20 && (
                                    <p style={mediumMutationStyle}>🟠 Medium mutation level - significant differences detected.</p>
                                )}
                                {results.editDistance > 20 && (
                                    <p style={highMutationStyle}>🔴 High mutation level - sequences are very different.</p>
                                )}
                            </div>
                        </div>

                        <div style={sequenceComparisonStyle}>
                            <h4 style={{ color: '#333', marginBottom: '1rem' }}>Sequence Comparison</h4>
                            <div style={comparisonGridStyle}>
                                <div>
                                    <strong>Sequence A Length:</strong> {sequenceA.length}
                                </div>
                                <div>
                                    <strong>Sequence B Length:</strong> {sequenceB.length}
                                </div>
                                <div>
                                    <strong>Length Difference:</strong> {Math.abs(sequenceA.length - sequenceB.length)}
                                </div>
                                <div>
                                    <strong>Similarity Score:</strong> {Math.max(0, 100 - (results.editDistance / Math.max(sequenceA.length, sequenceB.length) * 100)).toFixed(2)}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const sequencesContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    marginBottom: '1.5rem'
};

const sequenceColumnStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
};

const sequencePreviewStyle = {
    background: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #e1e5e9',
    fontSize: '0.9rem'
};

const previewTextStyle = {
    margin: '0.5rem 0',
    fontFamily: "'Courier New', monospace",
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all'
};

const mutationResultsStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
};

const resultCardStyle = {
    background: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #e1e5e9'
};

const metricGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem'
};

const metricStyle = {
    textAlign: 'center',
    padding: '1rem',
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #e1e5e9'
};

const metricLabelStyle = {
    display: 'block',
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '0.5rem'
};

const metricValueStyle = {
    display: 'block',
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#333'
};

const interpretationStyle = {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #e1e5e9'
};

const identicalStyle = {
    color: '#28a745',
    fontWeight: 'bold',
    margin: '0.5rem 0'
};

const lowMutationStyle = {
    color: '#ffc107',
    fontWeight: 'bold',
    margin: '0.5rem 0'
};

const mediumMutationStyle = {
    color: '#fd7e14',
    fontWeight: 'bold',
    margin: '0.5rem 0'
};

const highMutationStyle = {
    color: '#dc3545',
    fontWeight: 'bold',
    margin: '0.5rem 0'
};

const sequenceComparisonStyle = {
    background: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #e1e5e9'
};

const comparisonGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
};

export default MutationDetection;