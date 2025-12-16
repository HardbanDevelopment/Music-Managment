import React, { useState, useContext, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { getCreatorCatalogue, runCatalogueAudit } from '@/services/api';
import { AuditOpportunity, CatalogueAsset } from '@/types';
import { AuthContext, ToastContext } from '@/context/AuthContext';
import SuspenseLoader from '@/components/ui/SuspenseLoader';
import OpportunityCard from '@/components/analytics/OpportunityCard';
import { SharedIcons } from '@/components/common/Icons';

const CatalogueAuditPage: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { addToast } = useContext(ToastContext);
    const [opportunities, setOpportunities] = useState<AuditOpportunity[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitial, setIsInitial] = useState(true);

    const handleRunAudit = async () => {
        if (!user) {
            addToast('User not found!', 'error');
            return;
        }
        setIsLoading(true);
        setIsInitial(false);
        setOpportunities([]);
        
        const catalogue = await getCreatorCatalogue(user.id);
        if(catalogue.length === 0) {
            addToast('No catalogue items found to audit.', 'error');
            setIsLoading(false);
            return;
        }

        const results = await runCatalogueAudit(catalogue);
        setOpportunities(results);
        setIsLoading(false);
        addToast('Catalogue audit complete!', 'success');
    };

    const InitialState = () => (
        <Card className="text-center p-12">
            <div className="w-20 h-20 rounded-full bg-primary-purple/20 flex items-center justify-center mx-auto mb-4 text-primary-purple text-4xl">
                <SharedIcons.Audit />
            </div>
            <h2 className="text-2xl font-bold text-white">Unlock Hidden Potential in Your Catalogue</h2>
            <p className="text-gray-400 mt-2 max-w-xl mx-auto">
                Our AI will analyze your entire back-catalogue of music and books to identify hidden gems with untapped commercial potential. Discover which of your older works are relevant to today's trends.
            </p>
            <button
                onClick={handleRunAudit}
                disabled={isLoading}
                className="mt-8 bg-primary-purple hover:bg-purple-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform hover:scale-105 transition-all"
            >
                {isLoading ? 'Analyzing...' : 'Run Full Catalogue Audit'}
            </button>
        </Card>
    );

    return (
        <div className="space-y-8">
            {isInitial && <InitialState />}
            
            {!isInitial && (
                 <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-white">Audit Results</h2>
                        <button
                            onClick={handleRunAudit}
                            disabled={isLoading}
                            className="bg-dark-border hover:bg-primary-purple text-white font-bold py-2 px-4 rounded-lg text-sm"
                        >
                            {isLoading ? 'Running...' : 'Re-run Audit'}
                        </button>
                    </div>

                    {isLoading ? <div className="h-96"><SuspenseLoader /></div> : (
                        <div className="space-y-6">
                            {opportunities.length > 0 ? (
                                opportunities.map((op, index) => <OpportunityCard key={index} opportunity={op} />)
                            ) : (
                                <Card className="p-8 text-center text-gray-400">
                                    No specific opportunities found at this time. Your catalogue is looking solid!
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CatalogueAuditPage;
