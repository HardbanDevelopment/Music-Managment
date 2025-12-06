import React, { useEffect, useState, useContext } from 'react';
import { getPublishingData, addBook } from '../../services/api';
import { Book } from '../../types';
import BookCard from '../../components/publishing/BookCard';
import BookWizard from '../../components/publishing/BookWizard';
import { ToastContext } from '../../context/AuthContext';
import ResourceListPage from '../../components/common/ResourceListPage';

const Books: React.FC = () => {
    const { addToast } = useContext(ToastContext);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getPublishingData();
                if (mounted) setBooks(data.books);
            } catch (e: any) {
                addToast(`Nie udało się pobrać książek: ${e.message || e}`, 'error');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [addToast]);

    const handleBookAdded = async (bookData: Partial<Book>) => {
        try {
            const newBook = await addBook(bookData);
            setBooks(prev => [newBook, ...prev]);
            addToast('Book created successfully!', 'success');
        } catch (e: any) {
            addToast(`Nie udało się utworzyć książki: ${e.message || e}`, 'error');
        }
    };
    
    if (loading) {
        return <div className="h-48 w-full flex items-center justify-center text-gray-300">Ładowanie książek...</div>;
    }
    return (
        <ResourceListPage<Book>
            items={books}
            renderItem={(book, isSelected, onSelect) => (
                <BookCard 
                    book={book} 
                    isSelected={isSelected}
                    onSelect={onSelect}
                />
            )}
            searchKeys={['title', 'author']}
            searchPlaceholder="Search books..."
            addNewButtonText="New Book"
            addModalTitle="Create New Book"
            addModalContent={(onClose) => (
                <BookWizard 
                    onClose={onClose}
                    onComplete={handleBookAdded}
                />
            )}
            emptyState={{
                icon: <>📖</>,
                title: "Publish Your First Masterpiece",
                description: "Your library is empty. Add a book to start tracking sales and reaching readers globally.",
                ctaText: "+ Add New Book",
            }}
            gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        />
    );
};

export default Books;
