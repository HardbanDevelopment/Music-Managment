import React, { useEffect, useState, useContext } from 'react';
import { getArtists, addArtist } from '@/services/api';
import { Artist } from '@/types';
import ArtistCard from '@/components/music/ArtistCard';
import ResourceListPage from '@/components/common/ResourceListPage';
import { ToastContext } from '@/context/AuthContext';

const AddArtistForm: React.FC<{ onArtistAdded: (artist: Artist) => void }> = ({ onArtistAdded }) => {
    const [name, setName] = useState('');
    const { addToast } = useContext(ToastContext);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            try {
                const newArtist = await addArtist(name);
                onArtistAdded(newArtist);
                addToast('Artist added successfully!', 'success');
            } catch (e: any) {
                addToast(`Nie udało się dodać artysty: ${e.message || e}`, 'error');
            }
            setName('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm">Artist Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 bg-dark-bg p-2 rounded-md border border-dark-border" />
            </div>
            <div className="flex justify-end pt-4">
                <button type="submit" className="bg-primary-purple py-2 px-6 rounded-lg">Add Artist</button>
            </div>
        </form>
    );
};


const Artists: React.FC = () => {
    const { addToast } = useContext(ToastContext);
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getArtists();
                if (mounted) setArtists(data);
            } catch (e: any) {
                addToast(`Nie udało się pobrać listy artystów: ${e.message || e}`, 'error');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [addToast]);

    const handleArtistAdded = (newArtist: Artist) => {
        setArtists(prev => [newArtist, ...prev]);
    };
    
    if (loading) {
        return <div className="h-48 w-full flex items-center justify-center text-gray-300">Ładowanie artystów...</div>;
    }
    return (
        <ResourceListPage<Artist>
            items={artists}
            renderItem={(artist) => (
                <ArtistCard artist={artist} />
            )}
            searchKeys={['name']}
            searchPlaceholder="Search artists..."
            addNewButtonText="New Artist"
            addModalTitle="Add New Artist"
            addModalContent={(onClose) => (
                <AddArtistForm onArtistAdded={(artist) => {
                    handleArtistAdded(artist);
                    onClose();
                }} />
            )}
            emptyState={{
                icon: <>👥</>,
                title: "Build Your Roster",
                description: "No artists found yet. Add your first artist profile to begin tracking streams and managing releases.",
                ctaText: "+ Add New Artist",
            }}
            gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        />
    );
};

export default Artists;
