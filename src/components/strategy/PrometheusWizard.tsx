import React, { useState } from 'react';
import { apiPost } from '@/services/api';

interface PrometheusWizardProps {
    onComplete: (result: any) => void;
    onClose: () => void;
}

const PrometheusWizard: React.FC<PrometheusWizardProps> = ({ onComplete, onClose }) => {
    const [feature, setFeature] = useState<'lyrics' | 'strategy' | 'narration'>('lyrics');
    const [input, setInput] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        setLoading(true);
        try {
            let endpoint = '';
            switch (feature) {
                case 'lyrics':
                    endpoint = '/api/prometheus/generate-lyrics';
                    break;
                case 'strategy':
                    endpoint = '/api/prometheus/strategic-advice';
                    break;
                case 'narration':
                    endpoint = '/api/prometheus/immersive-narration';
                    break;
            }
            const response = await apiPost(endpoint, { prompt: input });
            setResult(response);
            onComplete(response);
        } catch (error) {
            console.error('Error in Prometheus Genesis:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 text-white">
            <h2 className="text-xl font-bold">Prometheus Genesis AI Tool</h2>
            <select 
                value={feature} 
                onChange={e => setFeature(e.target.value as any)} 
                className="w-full bg-dark-bg p-3 rounded-md border border-dark-border"
            >
                <option value="lyrics">Generate Lyrics</option>
                <option value="strategy">Strategic Advice</option>
                <option value="narration">Immersive Narration</option>
            </select>
            <textarea 
                value={input} 
                onChange={e => setInput(e.target.value)} 
                placeholder="Enter your prompt here..." 
                rows={4} 
                className="w-full bg-dark-bg p-3 rounded-md border border-dark-border"
            />
            <button 
                onClick={handleSubmit} 
                disabled={loading} 
                className="bg-primary-purple py-2 px-6 rounded-lg disabled:opacity-50"
            >
                {loading ? 'Processing...' : 'Generate'}
            </button>
            {result && (
                <div className="p-4 bg-dark-bg rounded-md">
                    <h3 className="font-bold">Result:</h3>
                    <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
            <button onClick={onClose} className="bg-dark-border py-2 px-6 rounded-lg">Close</button>
        </div>
    );
};

export default PrometheusWizard;