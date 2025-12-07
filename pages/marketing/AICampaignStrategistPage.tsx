import React, { useState, useContext, useEffect } from 'react';
import Card from '../../components/ui/Card';
import { getCreatorCatalogue, generateCampaignStrategy } from '../../services/api';
import { CatalogueAsset, CampaignStrategy } from '../../types';
import { AuthContext, ToastContext } from '../../context/AuthContext';
import SuspenseLoader from '../../components/ui/SuspenseLoader';
import { SharedIcons } from '../../components/common/Icons';

const StrategySectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ title, icon, children }) => (
    <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-dark-bg rounded-lg text-primary-purple">{icon}</div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        {children}
    </Card>
);

const StrategyDisplay: React.FC<{ strategy: CampaignStrategy }> = ({ strategy }) => (
    <div className="space-y-6 animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-white">{strategy.campaignTitle}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StrategySectionCard title="Target Audience" icon={<SharedIcons.Contacts />}>
                <p className="text-sm text-gray-300">{strategy.targetAudience}</p>
            </StrategySectionCard>
            <StrategySectionCard title="Key Messaging" icon={<SharedIcons.Campaigns />}>
                <p className="text-sm text-gray-300 italic">&quot;{strategy.keyMessaging}&quot;</p>
            </StrategySectionCard>
        </div>

        <StrategySectionCard title="Content Pillars" icon={<SharedIcons.ContentLibrary />}>
            <div className="flex flex-wrap gap-2">
                {strategy.contentPillars.map((pillar, index) => (
                    <span key={index} className="px-3 py-1 text-xs font-semibold rounded-full bg-primary-purple/20 text-primary-purple">
                        {pillar}
                    </span>
                ))}
            </div>
        </StrategySectionCard>

        <StrategySectionCard title="4-Week Timeline" icon={<SharedIcons.Calendar />}>
            <div className="space-y-4">
                {strategy.timeline.map((week, index) => (
                    <div key={index}>
                        <h4 className="font-semibold text-white">{week.week}</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-400 mt-1">
                            {week.activities.map((activity, actIndex) => (
                                <li key={actIndex}>{activity}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </StrategySectionCard>
        
        <StrategySectionCard title="Post Examples" icon={<SharedIcons.SocialMedia />}>
            <div className="space-y-4">
                {strategy.postExamples.map((post, index) => (
                    <div key={index} className="p-4 bg-dark-bg rounded-lg">
                        <p className="text-xs font-semibold text-gray-400 uppercase">{post.platform}</p>
                        <p className="text-sm text-gray-200 mt-2 whitespace-pre-wrap">{post.content}</p>
                        {post.imagePrompt && (
                             <p className="text-xs text-primary-purple/80 mt-2 italic">
                                <strong>Image Idea:</strong> {post.imagePrompt}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </StrategySectionCard>
    </div>
);

const AICampaignStrategistPage: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { addToast } = useContext(ToastContext);
    
    const [catalogue, setCatalogue] = useState<CatalogueAsset[]>([]);
    const [selectedAssetId, setSelectedAssetId] = useState<string>('');
    const [targetPlatform, setTargetPlatform] = useState<string>('Instagram');
    const [strategy, setStrategy] = useState<CampaignStrategy | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
    const fetchCatalogue = async () => {
        if (user) {
            const userCatalogue = await getCreatorCatalogue(user.id);
            setCatalogue(userCatalogue);
            if (userCatalogue.length > 0) {
                setSelectedAssetId(userCatalogue[0].id);
            }
        }
    };
    fetchCatalogue();
}, [user]);

    const handleGenerate = async () => {
        if (!selectedAssetId) {
            addToast('Please select an asset to promote.', 'error');
            return;
        }
        setIsLoading(true);
        setStrategy(null);

        const selectedAsset = catalogue.find(a => a.id === selectedAssetId);
        if (selectedAsset) {
            const result = await generateCampaignStrategy(selectedAsset, targetPlatform);
            setStrategy(result);
            addToast('Campaign strategy generated successfully!', 'success');
        } else {
             addToast('Could not find the selected asset.', 'error');
        }
        setIsLoading(false);
    };

    return (
        <div className="space-y-8">
            <Card className="p-8">
                 <div className="flex items-start space-x-4">
                    <div className="text-3xl mt-1 text-primary-purple"><SharedIcons.Strategist /></div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">AI Campaign Strategist</h1>
                        <p className="text-gray-400 mt-1">Generate a complete marketing plan for your release or book in seconds.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 items-end">
                    <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-300">1. Select Asset to Promote</label>
                        <select
                            value={selectedAssetId}
                            onChange={e => setSelectedAssetId(e.target.value)}
                            className="mt-1 block w-full bg-dark-bg border-dark-border rounded-md p-3"
                        >
                            {catalogue.map(asset => (
                                <option key={asset.id} value={asset.id}>
                                    {asset.type}: {asset.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-300">2. Select Target Platform</label>
                         <select
                            value={targetPlatform}
                            onChange={e => setTargetPlatform(e.target.value)}
                            className="mt-1 block w-full bg-dark-bg border-dark-border rounded-md p-3"
                        >
                            <option>Instagram</option>
                            <option>TikTok</option>
                            <option>X / Twitter</option>
                            <option>Email Newsletter</option>
                        </select>
                    </div>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !selectedAssetId}
                    className="mt-6 w-full bg-primary-blue hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center disabled:opacity-50"
                >
                    {isLoading ? <><div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>Generating Strategy...</> : '3. Generate Strategy'}
                </button>
            </Card>

            {isLoading && <div className="h-96"><SuspenseLoader /></div>}
            
            {strategy && <StrategyDisplay strategy={strategy} />}
        </div>
    );
};

export default AICampaignStrategistPage;
