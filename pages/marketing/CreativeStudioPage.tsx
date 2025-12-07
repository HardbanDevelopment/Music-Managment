import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import { generateTextContent, generateAIImage } from '../../services/api';
import { SharedIcons } from '../../components/common/Icons';

const TextGenerator = () => {
    const [topic, setTopic] = useState('');
    const [tone, setTone] = useState('Enthusiastic');
    const [platform, setPlatform] = useState('Instagram');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedContent, setGeneratedContent] = useState('');

    const handleGenerate = async () => {
        if (!topic) return;
        setIsLoading(true);
        setGeneratedContent('');
        const prompt = `Create a ${platform} post with an ${tone} tone about ${topic}.`;
        const content = await generateTextContent(prompt);
        setGeneratedContent(content);
        setIsLoading(false);
    };

    return (
        <Card className="p-8">
            <h3 className="text-2xl font-bold text-white mb-4">✍️ Text Content Generator</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="text-sm text-gray-400">Topic / Goal</label>
                    <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g., My new single 'Cosmic Dream'" className="mt-1 w-full bg-dark-bg p-3 rounded-lg border border-dark-border" />
                </div>
                <div>
                    <label className="text-sm text-gray-400">Tone of Voice</label>
                    <select value={tone} onChange={e => setTone(e.target.value)} className="mt-1 w-full bg-dark-bg p-3 rounded-lg border border-dark-border">
                        <option>Enthusiastic</option>
                        <option>Professional</option>
                        <option>Friendly</option>
                        <option>Playful</option>
                    </select>
                </div>
                <div>
                    <label className="text-sm text-gray-400">Platform</label>
                    <select value={platform} onChange={e => setPlatform(e.target.value)} className="mt-1 w-full bg-dark-bg p-3 rounded-lg border border-dark-border">
                        <option>Instagram</option>
                        <option>Twitter</option>
                        <option>Blog Post Idea</option>
                    </select>
                </div>
            </div>
            <button
                onClick={handleGenerate}
                disabled={isLoading || !topic}
                className="mt-6 w-full bg-primary-purple hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
            >
                {isLoading ? 'Generating...' : 'Generate Text'}
            </button>
            {generatedContent && (
                <div className="mt-6">
                     <h4 className="text-lg font-semibold text-white mb-2">Generated Text:</h4>
                     <textarea
                        readOnly
                        value={generatedContent}
                        className="w-full h-32 bg-dark-bg p-4 rounded-lg border border-dark-border text-gray-300 whitespace-pre-wrap"
                    />
                </div>
            )}
        </Card>
    );
};

const ImageGenerator = () => {
    const [prompt, setPrompt] = useState('');
    const [style, setStyle] = useState('Photorealistic');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

     const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        setGeneratedImage(null);
        const imageUrl = await generateAIImage(prompt, style);
        setGeneratedImage(imageUrl);
        setIsLoading(false);
    };

    return (
         <Card className="p-8">
            <h3 className="text-2xl font-bold text-white mb-4">🎨 AI Image Generator</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <label className="text-sm text-gray-400">Prompt</label>
                    <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="e.g., An astronaut DJing on the moon" className="mt-1 w-full bg-dark-bg p-3 rounded-lg border border-dark-border" />
                </div>
                <div>
                    <label className="text-sm text-gray-400">Style</label>
                    <select value={style} onChange={e => setStyle(e.target.value)} className="mt-1 w-full bg-dark-bg p-3 rounded-lg border border-dark-border">
                        <option>Photorealistic</option>
                        <option>Illustration</option>
                        <option>3D Render</option>
                        <option>Synthwave</option>
                    </select>
                </div>
            </div>
             <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt}
                className="mt-6 w-full bg-primary-blue hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50"
            >
                {isLoading ? 'Generating...' : 'Generate Image'}
            </button>
             {(isLoading || generatedImage) && (
                <div className="mt-6">
                     <h4 className="text-lg font-semibold text-white mb-2">Generated Image:</h4>
                     <div className="w-full aspect-square bg-dark-bg rounded-lg flex items-center justify-center border border-dark-border">
                        {isLoading ? (
                             <div className="w-8 h-8 border-t-2 border-primary-blue rounded-full animate-spin"></div>
                        ) : (
                            <img src={generatedImage!} alt="AI Generated" className="rounded-lg object-cover w-full h-full" />
                        )}
                     </div>
                </div>
            )}
        </Card>
    );
}

const CreativeStudioPage: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white">AI Creative Studio</h2>
                <p className="text-gray-400 mt-1">Your suite of AI-powered tools to generate engaging marketing assets.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <TextGenerator />
                <ImageGenerator />
            </div>
        </div>
    );
};

export default CreativeStudioPage;