
import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import { SharedIcons } from '../../components/common/Icons';
import { generateTextContent, generateAIImage } from '../../services/api';

const ImmersiveLab: React.FC = () => {
    const [conceptType, setConceptType] = useState('AR Filter');
    const [theme, setTheme] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedConcept, setGeneratedConcept] = useState<{text: string, image: string | null} | null>(null);

    const handleGenerate = async () => {
        if (!theme) return;
        setIsGenerating(true);
        
        // Simulate a complex AR/VR prompt generation
        const prompt = `Create a detailed concept for a ${conceptType} based on the theme: "${theme}". Describe the visual style, user interaction, and technical requirements for platforms like Spark AR or Lens Studio.`;
        const text = await generateTextContent(prompt);
        
        // Generate a visualization
        const imagePrompt = `Conceptual visualization of a ${conceptType} with theme ${theme}, futuristic, 3d render, unreal engine 5 style`;
        const image = await generateAIImage(imagePrompt, '3D Render');

        setGeneratedConcept({ text, image });
        setIsGenerating(false);
    };

    return (
        <div className="space-y-8">
             <Card className="p-8 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/50">
                <div className="flex items-center space-x-4">
                    <div className="text-4xl text-white"><SharedIcons.VR /></div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Immersive Lab (AR/VR)</h2>
                        <p className="text-gray-300 mt-1">Design the future of fan interaction. Generate concepts for Instagram Filters, VR Spaces, and Mixed Reality experiences.</p>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="p-6 lg:col-span-1">
                    <h3 className="text-xl font-bold text-white mb-4">Generate Concept</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Experience Type</label>
                            <select 
                                value={conceptType} 
                                onChange={(e) => setConceptType(e.target.value)}
                                className="w-full bg-dark-bg border-dark-border rounded-lg p-3 text-white"
                            >
                                <option>Instagram/TikTok AR Filter</option>
                                <option>VR Virtual Concert Stage</option>
                                <option>3D Merch Visualization</option>
                                <option>Mixed Reality Portal</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Theme / Vibe</label>
                            <textarea 
                                value={theme} 
                                onChange={(e) => setTheme(e.target.value)}
                                className="w-full bg-dark-bg border-dark-border rounded-lg p-3 text-white h-32"
                                placeholder="e.g., Cyberpunk noir city, floating neon skulls, interactive audio-reactive particles..."
                            />
                        </div>
                        <button 
                            onClick={handleGenerate} 
                            disabled={isGenerating || !theme}
                            className="w-full bg-primary-purple hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg disabled:opacity-50 transition-all"
                        >
                            {isGenerating ? 'Dreaming...' : 'Generate Experience'}
                        </button>
                    </div>
                </Card>

                <div className="lg:col-span-2">
                    {generatedConcept ? (
                        <div className="space-y-6 animate-fade-in">
                            <Card className="p-6">
                                <h3 className="text-xl font-bold text-white mb-4">Visual Concept</h3>
                                <div className="aspect-video w-full bg-dark-bg rounded-lg overflow-hidden border border-dark-border">
                                    {generatedConcept.image ? (
                                        <img src={generatedConcept.image} alt="AR Concept" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500">Visualizing...</div>
                                    )}
                                </div>
                            </Card>
                            <Card className="p-6">
                                <h3 className="text-xl font-bold text-white mb-4">Technical Brief</h3>
                                <div className="prose prose-invert max-w-none">
                                    <p className="text-gray-300 whitespace-pre-wrap">{generatedConcept.text}</p>
                                </div>
                                <div className="mt-6 flex space-x-4">
                                    <button className="px-4 py-2 bg-dark-bg border border-dark-border rounded hover:bg-dark-border text-sm text-gray-300">Download .obj Concept</button>
                                    <button className="px-4 py-2 bg-dark-bg border border-dark-border rounded hover:bg-dark-border text-sm text-gray-300">Export to Spark AR</button>
                                </div>
                            </Card>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-dark-card/50 rounded-2xl border-2 border-dashed border-dark-border">
                            <div className="text-6xl mb-4">🕶️</div>
                            <h3 className="text-xl font-bold text-white">Ready to Innovate?</h3>
                            <p className="text-gray-400 mt-2">Define your theme on the left to generate a cutting-edge AR/VR concept for your fans.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImmersiveLab;
