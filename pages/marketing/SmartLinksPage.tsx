
import React, { useState, useEffect } from 'react';
import { getSmartLinks, addSmartLink } from '../../services/api';
import { SmartLink } from '../../types';
import { SharedIcons } from '../../components/common/Icons';
import ResourceTablePage, { Column } from '../../components/common/ResourceTablePage';

const AddLinkModalContent: React.FC<{ onClose: () => void, onLinkAdded: (newLink: SmartLink) => void }> = ({ onClose, onLinkAdded }) => {
    const [name, setName] = useState('');
    const [originalUrl, setOriginalUrl] = useState('');
    const [type, setType] = useState<'Pre-Save' | 'Bio-Link' | 'Single'>('Pre-Save');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && originalUrl.trim()) {
            const newLink = await addSmartLink({ name, originalUrl, type });
            onLinkAdded(newLink);
            onClose();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                <label htmlFor="link-name" className="block text-sm font-medium text-gray-300">Link Name</label>
                <input type="text" id="link-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full bg-dark-bg border-dark-border rounded-md p-3" placeholder="e.g., New Single Pre-Save" />
            </div>
            <div>
                <label htmlFor="link-url" className="block text-sm font-medium text-gray-300">Original URL</label>
                <input type="url" id="link-url" value={originalUrl} onChange={(e) => setOriginalUrl(e.target.value)} className="mt-1 block w-full bg-dark-bg border-dark-border rounded-md p-3" placeholder="https://open.spotify.com/..." />
            </div>
                <div>
                <label htmlFor="link-type" className="block text-sm font-medium text-gray-300">Link Type</label>
                <select id="link-type" value={type} onChange={(e) => setType(e.target.value as any)} className="mt-1 block w-full bg-dark-bg border-dark-border rounded-md p-3">
                    <option>Pre-Save</option>
                    <option>Bio-Link</option>
                    <option>Single</option>
                </select>
            </div>
            <div className="flex justify-end pt-4 space-x-4">
                <button type="button" onClick={onClose} className="bg-dark-border text-white font-bold py-2 px-6 rounded-lg">Cancel</button>
                <button type="submit" className="bg-primary-purple hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg">Create Link</button>
            </div>
        </form>
    );
};


const SmartLinksPage: React.FC = () => {
    const [links, setLinks] = useState<SmartLink[]>([]);

    useEffect(() => {
        const fetchLinks = async () => {
            const fetchedLinks = await getSmartLinks();
            setLinks(fetchedLinks);
        };
        fetchLinks();
    }, []);

    const handleLinkAdded = (newLink: SmartLink) => {
        setLinks(prev => [newLink, ...prev]);
    };

    const columns: Column<SmartLink>[] = [
        { header: 'Name', render: (link) => <span className="font-medium text-white">{link.name}</span> },
        { header: 'Short URL', render: (link) => <span className="text-primary-purple">{link.shortUrl}</span> },
        { header: 'Type', render: (link) => <span className="text-gray-300">{link.type}</span> },
        { header: 'Clicks', render: (link) => <span className="text-gray-300">{link.clicks.toLocaleString()}</span> },
        { header: 'Conversions', render: (link) => <span className="text-gray-300">{link.conversions > 0 ? link.conversions.toLocaleString() : 'N/A'}</span> },
    ];

    return (
        <ResourceTablePage<SmartLink>
            title="Smart Links"
            subtitle="Create and manage pre-save links, bio links, and more."
            items={links}
            columns={columns}
            searchKeys={['name', 'shortUrl']}
            searchPlaceholder="Search links..."
            addNewButtonText="Create Link"
            addModalTitle="Create New Smart Link"
            addModalContent={(onClose) => <AddLinkModalContent onClose={onClose} onLinkAdded={handleLinkAdded} />}
            emptyState={{
                icon: <SharedIcons.SmartLink />,
                title: "Connect Your Fans",
                description: "No smart links found. Create a Pre-Save or Bio Link to direct your fans to your music and content across all platforms.",
                ctaText: "+ Create Smart Link"
            }}
        />
    );
};

export default SmartLinksPage;