
import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import Modal from '../ui/Modal';

export interface BulkAction {
    label: string;
    onClick: (selectedIds: string[]) => void;
    variant?: 'primary' | 'danger' | 'secondary';
    icon?: React.ReactNode;
}

interface EmptyStateConfig {
    icon: React.ReactNode;
    title: string;
    description: string;
    ctaText: string;
}

interface ResourceListPageProps<T extends { id: string }> {
    items: T[];
    // renderItem now receives isSelected and onSelect
    renderItem: (item: T, isSelected: boolean, onSelect: (id: string) => void) => React.ReactNode;
    searchKeys: (keyof T)[];
    searchPlaceholder: string;
    addNewButtonText: string;
    addModalTitle: string;
    addModalContent: (onClose: () => void) => React.ReactNode;
    emptyState: EmptyStateConfig;
    gridCols?: string; // Allow customizing grid columns for different card sizes
    bulkActions?: BulkAction[];
}

// A generic component to handle the common layout and logic for resource list pages
const ResourceListPage = <T extends { id: string }>({
    items,
    renderItem,
    searchKeys,
    searchPlaceholder,
    addNewButtonText,
    addModalTitle,
    addModalContent,
    emptyState,
    gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
    bulkActions
}: ResourceListPageProps<T>) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const handleSelect = (id: string) => {
        setSelectedItems(prev => 
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };
    
    const filteredItems = useMemo(() => {
        if (!searchTerm) return items;
        return items.filter(item =>
            searchKeys.some(key => {
                const value = item[key];
                return typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase());
            })
        );
    }, [items, searchTerm, searchKeys]);

    const handleSelectAll = () => {
        if (selectedItems.length === filteredItems.length && filteredItems.length > 0) {
             setSelectedItems([]);
        } else {
             setSelectedItems(filteredItems.map(item => item.id));
        }
    };

    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <div className="space-y-6">
            <Card className="p-4">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-dark-bg border border-dark-border rounded-lg p-2 text-sm w-64"
                        />
                         {filteredItems.length > 0 && (
                             <div className="flex items-center space-x-2">
                                <input 
                                    type="checkbox"
                                    checked={filteredItems.length > 0 && selectedItems.length === filteredItems.length}
                                    onChange={handleSelectAll}
                                    className="h-5 w-5 rounded bg-dark-bg border-gray-500 text-primary-purple focus:ring-primary-purple cursor-pointer"
                                />
                                <span className="text-sm text-gray-400">Select All</span>
                            </div>
                        )}
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="bg-primary-purple hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg">
                        + {addNewButtonText}
                    </button>
                </div>
            </Card>
            
            {selectedItems.length > 0 && bulkActions && (
                <Card className="p-4 bg-primary-purple/10 border border-primary-purple/30 animate-fade-in">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <div className="flex items-center space-x-4">
                            <span className="font-bold text-white">{selectedItems.length} selected</span>
                            <button onClick={() => setSelectedItems([])} className="text-sm text-gray-400 hover:text-white">
                                Clear Selection
                            </button>
                        </div>
                        <div className="flex space-x-3">
                            {bulkActions.map((action, idx) => {
                                const variantClasses = {
                                    primary: 'bg-primary-purple hover:bg-purple-500 text-white',
                                    danger: 'bg-error-red hover:bg-red-600 text-white',
                                    secondary: 'bg-dark-card hover:bg-dark-border text-gray-200 border border-gray-600'
                                };
                                const className = variantClasses[action.variant || 'secondary'];
                                
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            action.onClick(selectedItems);
                                            setSelectedItems([]);
                                        }}
                                        className={`px-4 py-2 rounded-lg font-semibold text-sm flex items-center space-x-2 transition-colors ${className}`}
                                    >
                                        {action.icon}
                                        <span>{action.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </Card>
            )}

            {filteredItems.length > 0 ? (
                <div className={`grid ${gridCols} gap-6`}>
                    {filteredItems.map(item => (
                        <div key={item.id}>
                            {renderItem(item, selectedItems.includes(item.id), handleSelect)}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 px-6 bg-dark-card rounded-2xl">
                    <div className="w-16 h-16 rounded-full bg-dark-bg flex items-center justify-center mx-auto mb-4 text-primary-purple text-3xl">
                        {emptyState.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white">{emptyState.title}</h3>
                    <p className="text-gray-400 mt-2">
                        {searchTerm ? `No results match your search for "${searchTerm}".` : emptyState.description}
                    </p>
                    {!searchTerm && (
                        <div className="mt-6">
                            <button onClick={() => setIsModalOpen(true)} className="bg-primary-purple hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg">
                                {emptyState.ctaText}
                            </button>
                        </div>
                    )}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={addModalTitle}>
                {addModalContent(handleCloseModal)}
            </Modal>
        </div>
    );
};

export default ResourceListPage;
