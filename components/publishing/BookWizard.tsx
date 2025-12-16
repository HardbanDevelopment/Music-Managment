import React, { useState } from 'react';
import { apiPost } from '../../services/api';
import { Book } from '../../types';

interface BookWizardProps {
    onComplete: (book: Partial<Book>) => void;
    onClose: () => void;
}

const BookWizard: React.FC<BookWizardProps> = ({ onComplete, onClose }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [coverArt, setCoverArt] = useState('');
    const [status, setStatus] = useState<'Published' | 'Draft'>('Draft');
    const [assetId, setAssetId] = useState('');
    const [isbn, setIsbn] = useState('');
    const [publisher, setPublisher] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;
        try {
            const response = await apiPost<{ book: Partial<Book>; blurb: string }>(
                '/api/prepare-publishing',
                {
                asset_id: assetId,
                isbn,
                publisher
                }
            );
            onComplete({ 
                ...response.book,
                title, 
                author, 
                status, 
                coverArt: coverArt || undefined 
            });
            onClose();
        } catch (error) {
            console.error('Error preparing publishing:', error);
            // Możesz dodać toast lub obsługę błędu tutaj
        }
    };

    const isFormValid = title.trim() !== '' && author.trim() !== '' && assetId.trim() !== '' && isbn.trim() !== '' && publisher.trim() !== '';

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-white">
            <div className="space-y-4">
                <div>
                    <label htmlFor="book-title" className="block text-sm font-medium text-gray-300">Book Title</label>
                    <input 
                        id="book-title"
                        type="text" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)} 
                        className="w-full mt-1 bg-dark-bg p-3 rounded-md border border-dark-border"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="author-name" className="block text-sm font-medium text-gray-300">Author Name</label>
                    <input 
                        id="author-name"
                        type="text" 
                        value={author} 
                        onChange={e => setAuthor(e.target.value)} 
                        className="w-full mt-1 bg-dark-bg p-3 rounded-md border border-dark-border"
                        required
                    />
                </div>
                 <div>
                    <label htmlFor="cover-art" className="block text-sm font-medium text-gray-300">Cover Art URL</label>
                    <input 
                        id="cover-art"
                        type="url" 
                        value={coverArt} 
                        onChange={e => setCoverArt(e.target.value)} 
                        className="w-full mt-1 bg-dark-bg p-3 rounded-md border border-dark-border"
                        placeholder="https://..."
                    />
                </div>
                 <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-300">Status</label>
                    <select 
                        id="status"
                        value={status} 
                        onChange={e => setStatus(e.target.value as 'Published' | 'Draft')} 
                        className="w-full mt-1 bg-dark-bg p-3 rounded-md border border-dark-border"
                    >
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="asset-id" className="block text-sm font-medium text-gray-300">Asset ID</label>
                    <input 
                        id="asset-id"
                        type="text" 
                        value={assetId} 
                        onChange={e => setAssetId(e.target.value)} 
                        className="w-full mt-1 bg-dark-bg p-3 rounded-md border border-dark-border"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="isbn" className="block text-sm font-medium text-gray-300">ISBN</label>
                    <input 
                        id="isbn"
                        type="text" 
                        value={isbn} 
                        onChange={e => setIsbn(e.target.value)} 
                        className="w-full mt-1 bg-dark-bg p-3 rounded-md border border-dark-border"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="publisher" className="block text-sm font-medium text-gray-300">Publisher</label>
                    <input 
                        id="publisher"
                        type="text" 
                        value={publisher} 
                        onChange={e => setPublisher(e.target.value)} 
                        className="w-full mt-1 bg-dark-bg p-3 rounded-md border border-dark-border"
                        required
                    />
                </div>
            </div>
            <div className="flex justify-end items-center pt-4 space-x-4">
                 <button type="button" onClick={onClose} className="bg-dark-border py-2 px-6 rounded-lg">Cancel</button>
                 <button 
                    type="submit" 
                    disabled={!isFormValid}
                    className="bg-primary-purple py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Create Book
                </button>
            </div>
        </form>
    );
};

export default BookWizard;
