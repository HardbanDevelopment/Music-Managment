
import React, { useState, useContext, useEffect } from 'react';
import { getMusicData, addRelease } from '../../services/api';
import { MusicRelease } from '../../types';
import ReleaseCard from '../../components/music/ReleaseCard';
import ReleaseWizard from '../../components/music/ReleaseWizard';
import { ToastContext } from '../../context/AuthContext';
import ResourceListPage, { BulkAction } from '../../components/common/ResourceListPage';
import Modal from '../../components/ui/Modal';

const Releases: React.FC = () => {
    const { addToast } = useContext(ToastContext);
    const [releases, setReleases] = useState<MusicRelease[]>([]);
    const [viewRelease, setViewRelease] = useState<MusicRelease | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getMusicData();
                if (mounted) setReleases(data.releases);
            } catch (e: any) {
                addToast(`Nie udało się pobrać listy wydań: ${e.message || e}`, 'error');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [addToast]);

    const handleReleaseAdded = async (releaseData: Partial<MusicRelease>) => {
        try {
            const newRelease = await addRelease(releaseData);
            setReleases(prev => [newRelease, ...prev]);
            addToast('Release created successfully!', 'success');
        } catch (e: any) {
            addToast(`Nie udało się utworzyć wydania: ${e.message || e}`, 'error');
        }
    };

    const bulkActions: BulkAction[] = [
        {
            label: 'Publish Selected',
            variant: 'primary',
            onClick: (ids) => {
                setReleases(prev => prev.map(r => ids.includes(r.id) ? { ...r, status: 'Published' } : r));
                addToast(`${ids.length} releases published!`, 'success');
            }
        },
        {
            label: 'Delete Selected',
            variant: 'danger',
            onClick: (ids) => {
                if (window.confirm(`Are you sure you want to delete ${ids.length} releases?`)) {
                     setReleases(prev => prev.filter(r => !ids.includes(r.id)));
                     addToast(`${ids.length} releases deleted.`, 'success');
                }
            }
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Published': return 'bg-success-green/20 text-success-green';
            case 'Pending': return 'bg-warning-yellow/20 text-warning-yellow';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="h-48 w-full flex items-center justify-center text-gray-300">Ładowanie wydań...</div>
        );
    }

    return (
        <>
            <ResourceListPage<MusicRelease>
                items={releases}
                renderItem={(release, isSelected, onSelect) => (
                    <ReleaseCard 
                        release={release} 
                        isSelected={isSelected}
                        onSelect={onSelect}
                        onView={setViewRelease}
                    />
                )}
                searchKeys={['title', 'artist']}
                searchPlaceholder="Search releases..."
                addNewButtonText="New Release"
                addModalTitle="Create New Release"
                addModalContent={(onClose) => (
                    <ReleaseWizard 
                        onClose={onClose}
                        onComplete={handleReleaseAdded}
                    />
                )}
                emptyState={{
                    icon: <>🎵</>,
                    title: "Start Your Discography",
                    description: "Your future hits belong here. Create your first release to start distributing your music to the world.",
                    ctaText: "+ Create New Release",
                }}
                gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                bulkActions={bulkActions}
            />

            <Modal 
                isOpen={!!viewRelease} 
                onClose={() => setViewRelease(null)} 
                title="Release Details"
            >
                {viewRelease && (
                    <div className="space-y-6">
                        <div className="flex flex-col items-center text-center">
                            <img src={viewRelease.coverArt} alt={viewRelease.title} className="w-48 h-48 object-cover rounded-lg shadow-lg mb-4" />
                            <h3 className="text-2xl font-bold text-white">{viewRelease.title}</h3>
                            <p className="text-lg text-gray-400">{viewRelease.artist}</p>
                            <div className="mt-3">
                                <span className={`px-4 py-1.5 text-sm font-semibold rounded-full ${getStatusColor(viewRelease.status)}`}>
                                    {viewRelease.status}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-6">
                             <div className="bg-dark-bg p-4 rounded-lg text-center border border-dark-border">
                                <p className="text-sm text-gray-400 mb-1">Total Streams</p>
                                <p className="text-xl font-bold text-white">{viewRelease.streams.toLocaleString()}</p>
                             </div>
                             <div className="bg-dark-bg p-4 rounded-lg text-center border border-dark-border">
                                <p className="text-sm text-gray-400 mb-1">Revenue</p>
                                <p className="text-xl font-bold text-success-green">${viewRelease.revenue.toLocaleString()}</p>
                             </div>
                             <div className="bg-dark-bg p-4 rounded-lg text-center border border-dark-border">
                                <p className="text-sm text-gray-400 mb-1">Active Platforms</p>
                                <p className="text-xl font-bold text-white">{viewRelease.platforms}</p>
                             </div>
                        </div>

                        <div className="bg-dark-bg p-4 rounded-lg border border-dark-border">
                            <h4 className="text-sm font-semibold text-white mb-2">Quick Actions</h4>
                            <div className="flex gap-3">
                                <button className="flex-1 bg-primary-purple/10 text-primary-purple hover:bg-primary-purple/20 py-2 rounded-md text-sm font-medium transition-colors">
                                    View Analytics
                                </button>
                                <button className="flex-1 bg-primary-blue/10 text-primary-blue hover:bg-primary-blue/20 py-2 rounded-md text-sm font-medium transition-colors">
                                    Manage Distribution
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex justify-end pt-2">
                            <button onClick={() => setViewRelease(null)} className="text-gray-400 hover:text-white transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default Releases;
