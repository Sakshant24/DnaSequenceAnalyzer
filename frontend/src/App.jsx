import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import FrequencyAnalysis from './components/FrequencyAnalysis';
import MotifSearch from './components/MotifSearch';
import MutationDetection from './components/MutationDetection';
import './App.css'; // Import the CSS

function App() {
    const [activeTab, setActiveTab] = useState('frequency');
    const [dnaSequence, setDnaSequence] = useState('');

    const renderActiveComponent = () => {
        switch (activeTab) {
            case 'frequency':
                return <FrequencyAnalysis dnaSequence={dnaSequence} />;
            case 'motif':
                return <MotifSearch dnaSequence={dnaSequence} />;
            case 'mutation':
                return <MutationDetection />;
            default:
                return <FrequencyAnalysis dnaSequence={dnaSequence} />;
        }
    };

    return (
        <div className="app">
            <Header />

            <div className="container">
                {/* Main DNA Sequence Input */}
                {activeTab !== 'mutation' && (
                    <FileUpload
                        title="📄 Main DNA Sequence Input"
                        onFileRead={setDnaSequence}
                        currentSequence={dnaSequence}
                    />
                )}

                {/* Navigation Tabs */}
                <div className="nav-tabs">
                    <button
                        className={`nav-tab ${activeTab === 'frequency' ? 'active' : ''}`}
                        onClick={() => setActiveTab('frequency')}
                    >
                        🧬 Frequency Analysis
                    </button>
                    <button
                        className={`nav-tab ${activeTab === 'motif' ? 'active' : ''}`}
                        onClick={() => setActiveTab('motif')}
                    >
                        🔍 Motif Search
                    </button>
                    <button
                        className={`nav-tab ${activeTab === 'mutation' ? 'active' : ''}`}
                        onClick={() => setActiveTab('mutation')}
                    >
                        🔄 Mutation Detection
                    </button>
                </div>

                {/* Active Component */}
                {renderActiveComponent()}

                {/* Quick Stats */}
                {dnaSequence && activeTab !== 'mutation' && (
                    <div className="card" style={{ textAlign: 'center', background: '#f8f9fa' }}>
                        <h4>Sequence Information</h4>
                        <div style={statsGridStyle}>
                            <div style={statItemStyle}>
                                <strong>Length</strong>
                                <div>{dnaSequence.length} characters</div>
                            </div>
                            <div style={statItemStyle}>
                                <strong>GC Content</strong>
                                <div>
                                    {((dnaSequence.match(/[GC]/gi)?.length || 0) / dnaSequence.length * 100).toFixed(2)}%
                                </div>
                            </div>
                            <div style={statItemStyle}>
                                <strong>AT Content</strong>
                                <div>
                                    {((dnaSequence.match(/[AT]/gi)?.length || 0) / dnaSequence.length * 100).toFixed(2)}%
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
};

const statItemStyle = {
    padding: '1rem',
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #e1e5e9'
};

export default App;