import React from 'react';
import { Artist } from '../../types';
import Card from '../ui/Card';
import { Link } from 'react-router-dom';

interface ArtistCardProps {
    artist: Artist;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
    return (
        <Link to={`/music/artists/${artist.id}`}>
            <Card className="p-6 text-center" onClick={() => {}}>
                <img src={artist.avatar} alt={artist.name} className="w-32 h-32 rounded-full mx-auto border-4 border-dark-border" />
                <h3 className="text-xl font-bold text-white mt-4">{artist.name}</h3>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-dark-bg p-2 rounded-lg">
                        <p className="text-gray-400">Monthly Listeners</p>
                        <p className="font-semibold text-white">{(artist.monthlyListeners / 1000000).toFixed(1)}M</p>
                    </div>
                    <div className="bg-dark-bg p-2 rounded-lg">
                        <p className="text-gray-400">Total Streams</p>
                        <p className="font-semibold text-white">{(artist.totalStreams / 1000000).toFixed(1)}M</p>
                    </div>
                </div>
            </Card>
        </Link>
    );
};

export default ArtistCard;
