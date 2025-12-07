import React, { useState, useContext } from 'react';
import Card from '../../components/ui/Card';
import { getBrandReport } from '../../services/api';
import { BrandReport, BrandKeyword } from '../../types';
import { AuthContext, ToastContext } from '../../context/AuthContext';
import SuspenseLoader from '../../components/ui/SuspenseLoader';
import { SharedIcons } from '../../components/common/Icons';
import BrandReportDisplay from '../../components/strategy/BrandReportDisplay';

const BrandSentinelPage: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { addToast } = useContext(ToastContext);
    
    const [keywords, setKeywords] = useState<BrandKeyword[]>([
        { id: 'kw1', text: user?.name || 'My Brand', isActive: true },
        { id: 'kw2', text: 'Cosmic Dream', isActive: true },
        { id: 'kw3', text: 'The Silent Forest', isActive: false },
    ]);
    const [report, setReport] = useState<BrandReport | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitial, setIsInitial] = useState(true);

    const handleRunAnalysis = async () => {
        if (!user) {
            addToast('User not found!', 'error');
            return;
        }
        const activeKeywords = keywords.filter(k => k.isActive);
        if (activeKeywords.length === 0) {
            addToast('Please select at least one keyword to analyze.', 'error');
            return;
        }

        setIsLoading(true);
        setIsInitial(false);
        setReport(null);

        const result = await getBrandReport(activeKeywords);
        setReport(result);
        setIsLoading(false);
        addToast('Brand analysis complete!', 'success');
    };

    const toggleKeyword = (id: string) => {
        setKeywords(currentKeywords =>
            currentKeywords.map(kw =>
                kw.id === id ? { ...kw, isActive: !kw.isActive } : kw
            )
        );
    };

    return (
        <div className="space-y-8">
            <Card className="p-8">
                <div className="flex items-start space-x-4">
                    <div className="text-3xl mt-1 text-primary-purple"><SharedIcons.Shield /></div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">AI Brand Sentinel</h1>
                        <p className="text-gray-400 mt-1">Monitor your public perception and get a strategic analysis of your brand's health.</p>
                    </div>
                </div>

                <div className="mt-6">
                    <label className="text-sm font-medium text-gray-300">Select Keywords to Analyze</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {keywords.map(kw => (
                            <button
                                key={kw.id}
                                onClick={() => toggleKeyword(kw.id)}
                                className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                                    kw.isActive
                                        ? 'bg-primary-purple text-white'
                                        : 'bg-dark-bg text-gray-400 hover:bg-dark-border'
                                }`}
                            >
                                {kw.isActive ? '✓ ' : ''}{kw.text}
                            </button>
                        ))}
                    </div>
                </div>
                 <button
                    onClick={handleRunAnalysis}
                    disabled={isLoading}
                    className="mt-6 w-full bg-primary-blue hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center disabled:opacity-50"
                 >
                    {isLoading ? <><div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>Analyzing Brand...</> : 'Run Brand Analysis'}
                 </button>
            </Card>

            {isLoading && <div className="h-96"><SuspenseLoader /></div>}

            {report && <BrandReportDisplay report={report} />}

             {isInitial && !isLoading && (
                <Card className="text-center p-12 border-2 border-dashed border-dark-border">
                    <p className="text-gray-400">Your brand report will appear here once the analysis is complete.</p>
                </Card>
            )}
        </div>
    );
};

export default BrandSentinelPage;