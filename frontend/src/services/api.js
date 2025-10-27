import axios from 'axios';
const API_BASE_URL = 'http://localhost:8080/api/v1/analyze';
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

api.interceptors.request.use(
    (config) => {
        console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error);
        if (error.response) {
            // Server responded with error status
            throw new Error(error.response.data.message || `Server error: ${error.response.status}`);
        } else if (error.request) {
            // Request made but no response received
            throw new Error('No response from server. Please check if the backend is running.');
        } else {
            // Something else happened
            throw new Error('Request failed: ' + error.message);
        }
    }
);

export const dnaAnalysisService = {
    // Frequency Analysis
    analyzeFrequency: async (dnaSequence, k) => {
        const response = await api.post('/frequency', {
            dnaSequence: dnaSequence.trim(),
            k: parseInt(k)
        });
        return response.data;
    },

    // Motif Search
    analyzeMotif: async (dnaSequence, motif) => {
        const response = await api.post('/motif', {
            dnaSequence: dnaSequence.trim(),
            motif: motif.trim()
        });
        return response.data;
    },

    // Mutation Detection
    analyzeMutation: async (sequenceA, sequenceB) => {
        const response = await api.post('/mutation', {
            sequenceA: sequenceA.trim(),
            sequenceB: sequenceB.trim()
        });
        return response.data;
    }
};

export default api;