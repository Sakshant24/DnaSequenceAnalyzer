import React, { useState } from 'react';
import { dnaAnalysisService } from '../services/api';

const MotifSearch = ({ dnaSequence }) => {
    const [motif, setMotif] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!dnaSequence.trim()) {
            setError('Please provide a DNA sequence first');
            return;
        }
        if (!motif.trim()) {
            setError('Please enter a motif to search for');
            return;
        }
        if (motif.length > dnaSequence.length) {
            setError('Motif cannot be longer than the DNA sequence');
            return;
        }
        setLoading(true);
        setError('');
        setResults(null);
        try {
            const searchResults = await dnaAnalysisService.analyzeMotif(dnaSequence, motif);
            setResults(searchResults);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const highlightMotifInSequence = (sequence, motif, locations) => {
        let highlighted = '';
        let lastIndex = 0;

        locations.forEach((location, index) => {
            highlighted += sequence.slice(lastIndex, location);
            highlighted += `<mark style="background: #ffeb3b; padding: 2px 4px; border-radius: 3px; font-weight: bold;">${sequence.slice(location, location + motif.length)}</mark>`;
            lastIndex = location + motif.length;
        });
        highlighted += sequence.slice(lastIndex);
        return highlighted;
    };

    return (
        <div className="card">
            <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>🔍 Motif Search</h2>

            <div className="form-group">
                <label className="form-label">Motif to Search For:</label>
                <input
                    type="text"
                    value={motif}
                    onChange={(e) => setMotif(e.target.value.toUpperCase().replace(/[^ATCG]/g, ''))}
                    placeholder="Enter motif (e.g., ATTCG)"
                    className="form-input"
                    style={{ fontFamily: "'Courier New', monospace" }}
                />
                <small style={{ color: '#666', marginTop: '0.5rem', display: 'block' }}>
                    Enter a DNA subsequence to find all occurrences in the main sequence
                </small>
            </div>

            <button
                onClick={handleSearch}
                disabled={loading || !dnaSequence || !motif}
                className="btn"
            >
                {loading ? <div className="loading"></div> : '🔎'}
                {loading ? ' Searching...' : ' Search Motif'}
            </button>

            {error && <div className="error-message">{error}</div>}

            {results && (
                <div className="results-container">
                    <h3 style={{ color: '#333', marginBottom: '1rem' }}>Search Results</h3>

                    <div style={resultsSummaryStyle}>
                        <p><strong>Motif Searched:</strong> <code>{results.motifSearched}</code></p>
                        <p><strong>Total Occurrences:</strong> {results.totalOccurrences}</p>
                        <p><strong>Locations Found:</strong> {results.locationsFound.join(', ') || 'None'}</p>
                    </div>

                    {results.totalOccurrences > 0 && (
                        <div style={{ marginTop: '2rem' }}>
                            <h4 style={{ marginBottom: '1rem' }}>Sequence with Highlighted Motifs</h4>
                            <div style={sequenceDisplayStyle}>
                <pre
                    dangerouslySetInnerHTML={{
                        __html: highlightMotifInSequence(
                            dnaSequence,
                            results.motifSearched,
                            results.locationsFound
                        )
                    }}
                />
                            </div>

                            <div style={{ marginTop: '1.5rem' }}>
                                <h4>Detailed Locations</h4>
                                <div style={locationsGridStyle}>
                                    {results.locationsFound.map((location, index) => (
                                        <div key={index} style={locationCardStyle}>
                                            <strong>Position {location}</strong>
                                            <br />
                                            <code>
                                                {dnaSequence.slice(Math.max(0, location - 5), location)}
                                                <mark style={{ background: '#ffeb3b', fontWeight: 'bold' }}>
                                                    {dnaSequence.slice(location, location + results.motifSearched.length)}
                                                </mark>
                                                {dnaSequence.slice(location + results.motifSearched.length, location + results.motifSearched.length + 5)}
                                            </code>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const resultsSummaryStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
    padding: '1rem',
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #e1e5e9'
};

const sequenceDisplayStyle = {
    background: '#f8f9fa',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #e1e5e9',
    overflowX: 'auto',
    fontFamily: "'Courier New', monospace",
    fontSize: '0.9rem',
    lineHeight: '1.5'
};

const locationsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
};

const locationCardStyle = {
    background: 'white',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #e1e5e9',
    fontFamily: "'Courier New', monospace",
    fontSize: '0.9rem'
};

export default MotifSearch;