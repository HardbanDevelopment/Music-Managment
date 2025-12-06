import React, { useState } from 'react';
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onComplete({ 
            title, 
            author, 
            status, 
            coverArt: coverArt || undefined // Pass undefined if empty to allow default in API
        });
        onClose();
    };

    const isFormValid = title.trim() !== '' && author.trim() !== '';

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
