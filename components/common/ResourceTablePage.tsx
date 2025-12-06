
import React, { useState, useMemo } from 'react';
import Card from '../ui/Card';
import Modal from '../ui/Modal';

export interface Column<T> {
    header: string;
    render: (item: T) => React.ReactNode;
    className?: string; // For width or alignment
}

interface EmptyStateConfig {
    icon: React.ReactNode;
    title: string;
    description: string;
    ctaText: string;
}

interface ResourceTablePageProps<T extends { id: string }> {
    title: string;
    subtitle?: string;
    items: T[];
    columns: Column<T>[];
    searchKeys: (keyof T)[];
    searchPlaceholder: string;
    addNewButtonText: string;
    addModalTitle: string;
    addModalContent: (onClose: () => void) => React.ReactNode;
    emptyState: EmptyStateConfig;
    filterOptions?: {
        label: string;
        options: string[];
        selected: string;
        onSelect: (value: string) => void;
    };
}

const ResourceTablePage = <T extends { id: string }>({
    title,
    subtitle,
    items,
    columns,
    searchKeys,
    searchPlaceholder,
    addNewButtonText,
    addModalTitle,
    addModalContent,
    emptyState,
    filterOptions
}: ResourceTablePageProps<T>) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredItems = useMemo(() => {
        if (!searchTerm) return items;
        return items.filter(item =>
            searchKeys.some(key => {
                const value = item[key];
                return typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase());
            })
        );
    }, [items, searchTerm, searchKeys]);

    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <div>
                    <h2 className="text-2xl font-bold text-white">{title}</h2>
                    {subtitle && <p className="text-gray-400">{subtitle}</p>}
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary-purple hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all"
                >
                    + {addNewButtonText}
                </button>
            </div>

            <Card>
                 <div className="p-4 border-b border-dark-border flex justify-between items-center">
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="bg-dark-bg border border-dark-border rounded-lg p-2 text-sm w-64"
                    />
                    {filterOptions && (
                        <div className="flex items-center space-x-2">
                            <label className="text-sm text-gray-400">{filterOptions.label}</label>
                            <select
                                value={filterOptions.selected}
                                onChange={e => filterOptions.onSelect(e.target.value)}
                                className="bg-dark-bg border border-dark-border rounded-lg p-2 text-sm"
                            >
                                {filterOptions.options.map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                        </div>
                    )}
                 </div>

                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-dark-border">
                        <thead className="bg-dark-bg">
                            <tr>
                                {columns.map((col, index) => (
                                    <th key={index} className={`px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase ${col.className || ''}`}>
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                            {filteredItems.length > 0 ? (
                                filteredItems.map(item => (
                                    <tr key={item.id} className="hover:bg-dark-bg transition-colors">
                                        {columns.map((col, index) => (
                                            <td key={index} className="px-6 py-4 text-sm whitespace-nowrap">
                                                {col.render(item)}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="text-center py-16 px-6">
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
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={addModalTitle}>
                {addModalContent(handleCloseModal)}
            </Modal>
        </div>
    );
};

export default ResourceTablePage;