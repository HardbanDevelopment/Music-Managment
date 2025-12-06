import React from 'react';
import Card from '../../components/ui/Card';

const platforms = [
  { name: 'Spotify', logo: 'https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Green.png', status: 'Live' },
  { name: 'Apple Music', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Apple_Music_icon.svg/1024px-Apple_Music_icon.svg.png', status: 'Live' },
  { name: 'Amazon Music', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Amazon_Music_logo.svg/1024px-Amazon_Music_logo.svg.png', status: 'Live' },
  { name: 'YouTube Music', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Youtube_Music_icon.svg/1024px-Youtube_Music_icon.svg.png', status: 'Live' },
  { name: 'Deezer', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Deezer_logo.svg/1024px-Deezer_logo.svg.png', status: 'Live' },
  { name: 'Tidal', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Tidal_logo.svg/1024px-Tidal_logo.svg.png', status: 'Live' },
  { name: 'Pandora', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Pandora_logo.svg/1024px-Pandora_logo.svg.png', status: 'Action Required' },
  { name: 'TikTok', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a9/TikTok_logo.svg/330px-TikTok_logo.svg.png', status: 'Live' },
];

const StatusIndicator: React.FC<{ status: string }> = ({ status }) => {
    const baseClasses = "w-2 h-2 rounded-full";
    const colorClass = status === 'Live' ? "bg-success-green" : "bg-warning-yellow";
    return <div className={`${baseClasses} ${colorClass}`}></div>;
};

const Distribution: React.FC = () => {
    return (
        <div className="space-y-6">
             <Card className="p-6">
                 <h2 className="text-2xl font-bold text-white">Global Distribution</h2>
                 <p className="text-gray-400 mt-1">Monitor the status of your releases across 400+ platforms.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {platforms.map(platform => (
                    <Card key={platform.name} className="p-4 flex items-center space-x-4">
                         <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center p-2">
                           <img src={platform.logo} alt={platform.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-white">{platform.name}</p>
                            <div className="flex items-center space-x-2 text-xs">
                                <StatusIndicator status={platform.status} />
                                <span className={platform.status === 'Live' ? 'text-gray-400' : 'text-warning-yellow'}>
                                    {platform.status}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Distribution;
