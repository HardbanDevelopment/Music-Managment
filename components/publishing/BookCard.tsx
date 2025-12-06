
import React from 'react';
import { Book } from '../../types';
import Card from '../ui/Card';

interface BookCardProps {
    book: Book;
    // FIX: Make isSelected and onSelect optional for display-only usage.
    isSelected?: boolean;
    onSelect?: (id: string) => void;
}

const StatusBadge: React.FC<{ status: Book['status'] }> = ({ status }) => {
    const colorClasses = {
        Published: 'bg-success-green/20 text-success-green',
        Draft: 'bg-gray-500/20 text-gray-400',
    };
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colorClasses[status]}`}>
            {status}
        </span>
    );
};

const BookCard: React.FC<BookCardProps> = ({ book, isSelected = false, onSelect }) => {
    const handleCardClick = () => {
        onSelect?.(book.id);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        onSelect?.(book.id);
    };

    return (
        <div className="relative">
            <Card className={`overflow-hidden group transition-all duration-200 ${isSelected ? 'ring-2 ring-primary-purple scale-105' : 'ring-0'}`} onClick={onSelect ? handleCardClick : undefined}>
                <div className="relative">
                    <img src={book.coverArt} alt={book.title} className="w-full h-64 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    {/* FIX: Conditionally render selection UI only if onSelect is provided. */}
                    {onSelect && (
                        <div className="absolute top-2 left-2 z-10">
                            <input 
                                type="checkbox"
                                checked={isSelected}
                                onChange={handleCheckboxChange}
                                onClick={(e) => e.stopPropagation()}
                                className="h-5 w-5 rounded bg-dark-bg/50 border-gray-500 text-primary-purple focus:ring-primary-purple"
                            />
                        </div>
                    )}
                    <div className="absolute bottom-4 left-4">
                        <h3 className="text-xl font-bold text-white">{book.title}</h3>
                        <p className="text-sm text-gray-300">{book.author}</p>
                    </div>
                    <div className="absolute top-4 right-4">
                        <StatusBadge status={book.status} />
                    </div>
                </div>
                <div className="p-4 bg-dark-bg/50">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="text-xs text-gray-400">Sales</p>
                            <p className="text-lg font-semibold text-white">{book.sales.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Revenue</p>
                            <p className="text-lg font-semibold text-white">${book.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Stores</p>
                            <p className="text-lg font-semibold text-white">{book.stores}</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default BookCard;
