
import React, { useState } from 'react';
import { getPressReleases, addPressRelease, generateTextContent } from '@/services/api';
import { PressRelease } from '@/types';
import ResourceTablePage, { Column } from '@/components/common/ResourceTablePage';

const CreatePressReleaseModalContent: React.FC<{ onClose: () => void, onReleaseAdded: (newRelease: PressRelease) => void }> = ({ onClose, onReleaseAdded }) => {
    const [title, setTitle] = useState('');
    const [points, setPoints] = useState('');
    const [content, setContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!title || !points) return;
        setIsGenerating(true);
        const prompt = `Create a press release titled "${title}" with these key points: ${points}`;
        const generated = await generateTextContent(prompt);
        setContent(generated);
        setIsGenerating(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            const newRelease = await addPressRelease({ title });
            onReleaseAdded(newRelease);
            onClose();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-300">Press Release Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full bg-dark-bg border-dark-border rounded-md p-3" placeholder="e.g., Artist Announces World Tour" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300">Key Points (for AI Assistant)</label>
                <textarea value={points} onChange={(e) => setPoints(e.target.value)} rows={3} className="mt-1 block w-full bg-dark-bg border-dark-border rounded-md p-3" placeholder="1. New album drops Dec 1st.&#10;2. Tour starts in New York.&#10;3. Special guest will be..." />
            </div>
            <button type="button" onClick={handleGenerate} disabled={isGenerating || !title || !points} className="w-full bg-primary-blue text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50">
                {isGenerating ? 'Generating...' : '✨ Use AI Assistant to Write'}
            </button>
            <div>
                <label className="block text-sm font-medium text-gray-300">Content</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} className="mt-1 block w-full bg-dark-bg border-dark-border rounded-md p-3" />
            </div>
            <div className="flex justify-end pt-4 space-x-4">
                <button type="button" onClick={onClose} className="bg-dark-border text-white font-bold py-2 px-6 rounded-lg">Cancel</button>
                <button type="submit" className="bg-primary-purple hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg">Save Draft</button>
            </div>
        </form>
    );
};

const PressReleasePage: React.FC = () => {
    const [releases, setReleases] = useState(getPressReleases());

    const handleReleaseAdded = (newRelease: PressRelease) => {
        setReleases(prev => [newRelease, ...prev]);
    };

    const columns: Column<PressRelease>[] = [
        { header: 'Title', render: (r) => <span className="font-medium text-white">{r.title}</span> },
        { header: 'Status', render: (r) => (
            <span className={`px-2 py-1 text-xs rounded-full ${r.status === 'Sent' ? 'bg-success-green/20 text-success-green' : 'bg-gray-500/20 text-gray-300'}`}>
                {r.status}
            </span>
        )},
        { header: 'Sent Date', render: (r) => <span className="text-gray-300">{r.sentDate || 'N/A'}</span> },
        { header: 'Open Rate', render: (r) => <span className="text-gray-300">{r.openRate > 0 ? `${r.openRate}%` : 'N/A'}</span> },
    ];

    return (
        <ResourceTablePage<PressRelease>
            title="Press Releases"
            subtitle="Manage and distribute your announcements."
            items={releases}
            columns={columns}
            searchKeys={['title']}
            searchPlaceholder="Search releases..."
            addNewButtonText="Create Press Release"
            addModalTitle="Create New Press Release"
            addModalContent={(onClose) => <CreatePressReleaseModalContent onClose={onClose} onReleaseAdded={handleReleaseAdded} />}
            emptyState={{
                icon: <span className="text-4xl">📰</span>,
                title: "Announce Your News",
                description: "You haven't created any press releases yet. Draft an official announcement to share your latest achievements with the media.",
                ctaText: "+ Write Press Release"
            }}
        />
    );
};

export default PressReleasePage;