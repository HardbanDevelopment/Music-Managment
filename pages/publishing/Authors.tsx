import React, { useEffect, useState, useContext } from 'react';
import { getAuthors, addAuthor } from '../../services/api';
import { Author } from '../../types';
import AuthorCard from '../../components/publishing/AuthorCard';
import ResourceListPage from '../../components/common/ResourceListPage';
import { ToastContext } from '../../context/AuthContext';

const AddAuthorForm: React.FC<{ onAuthorAdded: (author: Author) => void }> = ({ onAuthorAdded }) => {
    const [name, setName] = useState('');
    const { addToast } = useContext(ToastContext);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            try {
                const newAuthor = await addAuthor(name);
                onAuthorAdded(newAuthor);
                addToast('Author added successfully!', 'success');
            } catch (e: unknown) {
                addToast(`Nie udało się dodać autora: ${(e instanceof Error) ? e.message : String(e)}`, 'error');
            }
            setName('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm">Author Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 bg-dark-bg p-2 rounded-md border border-dark-border" />
            </div>
            <div className="flex justify-end pt-4">
                <button type="submit" className="bg-primary-purple py-2 px-6 rounded-lg">Add Author</button>
            </div>
        </form>
    );
};

const Authors: React.FC = () => {
    const { addToast } = useContext(ToastContext);
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getAuthors();
                if (mounted) setAuthors(data);
            } catch (e: unknown) {
                addToast(`Nie udało się pobrać autorów: ${(e instanceof Error) ? e.message : String(e)}`, 'error');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [addToast]);

    const handleAuthorAdded = (newAuthor: Author) => {
        setAuthors(prev => [newAuthor, ...prev]);
    };
    
    if (loading) {
        return <div className="h-48 w-full flex items-center justify-center text-gray-300">Ładowanie autorów...</div>;
    }
    return (
        <ResourceListPage<Author>
            items={authors}
            renderItem={(author) => <AuthorCard author={author} />}
            searchKeys={['name']}
            searchPlaceholder="Search authors..."
            addNewButtonText="New Author"
            addModalTitle="Add New Author"
            addModalContent={(onClose) => (
                <AddAuthorForm onAuthorAdded={(author) => {
                    handleAuthorAdded(author);
                    onClose();
                }} />
            )}
            emptyState={{
                icon: <>✍️</>,
                title: "Manage Your Authors",
                description: "No authors found. Create an author profile to organize books and track individual performance.",
                ctaText: "+ Add New Author",
            }}
            gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        />
    );
};

export default Authors;
