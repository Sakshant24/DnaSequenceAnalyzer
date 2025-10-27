import React, { useState } from 'react';

const FileUpload = ({ onFileRead, currentSequence, title, allowTextInput = true, isSecondSequence = false }) => {
    const [sequence, setSequence] = useState(currentSequence || '');
    const [fileName, setFileName] = useState('');

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
            const reader = new FileReader();

            reader.onload = (e) => {
                const content = e.target.result;
                const lines = content.split('\n');
                const cleanedDna = lines

                    .map(line => {
                        if (line.startsWith('sequence') || line.trim() === '') {
                            return '';
                        }
                        return line.split('\t')[0];
                    })
                    .join('')

                    .replace(/[^ATCG]/gi, '')
                    .toUpperCase();
                setSequence(cleanedDna);
                onFileRead(cleanedDna);
            };
            reader.readAsText(file);
        }
    };

    const handleTextChange = (event) => {
        const newSequence = event.target.value.toUpperCase().replace(/[^ATCG\s]/g, '');
        setSequence(newSequence);
        onFileRead(newSequence);
    };

    const clearSequence = () => {
        setSequence('');
        setFileName('');
        onFileRead('');
    };

    return (
        <div className="card">
            <h3 style={{ marginBottom: '1.5rem', color: '#333', borderBottom: '2px solid #667eea', paddingBottom: '0.5rem' }}>
                {title}
            </h3>

            {/* File Upload Section */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={fileInputLabelStyle}>
                    <input
                        type="file"
                        accept=".txt,.fasta,.fa,.dna"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                    📁 Upload DNA File
                </label>
                {fileName && (
                    <div style={fileInfoStyle}>
                        <span>Selected: {fileName}</span>
                        <button onClick={clearSequence} style={clearButtonStyle}>✕</button>
                    </div>
                )}
            </div>

            {/* Text Input Section */}
            {allowTextInput && (
                <div className="form-group">
                    <label className="form-label">
                        Or paste DNA sequence directly (A, T, C, G only):
                    </label>
                    <textarea
                        value={sequence}
                        onChange={handleTextChange}
                        placeholder="Enter DNA sequence (e.g., ATTCGATTCGTT)..."
                        style={textareaStyle}
                        rows={isSecondSequence ? 4 : 6}
                    />
                    {sequence && (
                        <div style={sequenceInfoStyle}>
                            <span>Sequence length: {sequence.length} characters</span>
                            <button onClick={clearSequence} style={clearButtonStyle}>Clear</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const fileInputLabelStyle = {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontWeight: '600',
    fontSize: '1rem'
};

const fileInfoStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.5rem',
    padding: '0.5rem',
    background: '#f8f9fa',
    borderRadius: '5px',
    fontSize: '0.9rem'
};

const textareaStyle = {
    width: '100%',
    padding: '1rem',
    border: '2px solid #e1e5e9',
    borderRadius: '8px',
    fontFamily: "'Courier New', monospace",
    fontSize: '1rem',
    resize: 'vertical',
    transition: 'border-color 0.3s ease'
};

const sequenceInfoStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '0.5rem',
    fontSize: '0.9rem',
    color: '#666'
};

const clearButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#dc3545',
    cursor: 'pointer',
    fontSize: '1rem',
    padding: '2px 6px'
};

export default FileUpload;