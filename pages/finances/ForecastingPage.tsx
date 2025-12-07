import React, { useState, useContext, useEffect } from 'react';
import Card from '../../components/ui/Card';
import { getCreatorCatalogue, runSalesForecast } from '../../services/api';
import { CatalogueAsset, SalesForecast } from '../../types';
import { AuthContext, ToastContext } from '../../context/AuthContext';
import SuspenseLoader from '../../components/ui/SuspenseLoader';
import { SharedIcons } from '../../components/common/Icons';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, AreaChart } from 'recharts';

const ForecastingPage: React.FC = () => {
    const { user } = useContext(AuthContext);
    const { addToast } = useContext(ToastContext);

    const [catalogue, setCatalogue] = useState<CatalogueAsset[]>([]);
    const [selectedAssetId, setSelectedAssetId] = useState<string>('');
    const [forecastPeriod, setForecastPeriod] = useState<number>(6);
    const [forecast, setForecast] = useState<SalesForecast | null>(null);
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

    const handleGenerateForecast = async () => {
        if (!selectedAssetId) {
            addToast('Please select an asset to forecast.', 'error');
            return;
        }
        setIsLoading(true);
        setForecast(null);
        
        const selectedAsset = catalogue.find(a => a.id === selectedAssetId);
        if (selectedAsset) {
            const result = await runSalesForecast(selectedAsset, forecastPeriod);
            setForecast(result);
            addToast('Sales forecast generated successfully!', 'success');
        } else {
            addToast('Could not find the selected asset.', 'error');
        }

        setIsLoading(false);
    };

    const unitLabel = catalogue.find(a => a.id === selectedAssetId)?.type === 'Music' ? 'Streams' : 'Sales';
    const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    const numberFormatter = new Intl.NumberFormat('en-US');

    return (
        <div className="space-y-8">
            <Card className="p-8">
                <div className="flex items-start space-x-4">
                    <div className="text-3xl mt-1 text-primary-purple"><SharedIcons.Forecast /></div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Sales & Revenue Forecasting</h1>
                        <p className="text-gray-400 mt-1">Use AI to predict the future performance of your creative assets and make smarter business decisions.</p>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 items-end">
                    <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-300">Select Asset to Forecast</label>
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
                        <label className="text-sm font-medium text-gray-300">Forecast Period</label>
                        <select
                            value={forecastPeriod}
                            onChange={e => setForecastPeriod(Number(e.target.value))}
                            className="mt-1 block w-full bg-dark-bg border-dark-border rounded-md p-3"
                        >
                            <option value={3}>Next 3 Months</option>
                            <option value={6}>Next 6 Months</option>
                            <option value={12}>Next 12 Months</option>
                        </select>
                    </div>
                 </div>
                 <button
                    onClick={handleGenerateForecast}
                    disabled={isLoading || !selectedAssetId}
                    className="mt-6 w-full bg-primary-blue hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg flex items-center justify-center disabled:opacity-50"
                 >
                    {isLoading ? <><div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>Generating Forecast...</> : 'Generate Forecast'}
                 </button>
            </Card>

            {isLoading && <div className="h-96"><SuspenseLoader /></div>}

            {forecast && (
                <div className="space-y-8 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="p-6 text-center">
                             <p className="text-sm text-gray-400">Projected {unitLabel}</p>
                             <p className="text-4xl font-bold text-white">{numberFormatter.format(forecast.projectedUnits)}</p>
                        </Card>
                        <Card className="p-6 text-center">
                             <p className="text-sm text-gray-400">Projected Revenue</p>
                             <p className="text-4xl font-bold text-success-green">{currencyFormatter.format(forecast.projectedRevenue)}</p>
                        </Card>
                         <Card className="p-6 text-center">
                             <p className="text-sm text-gray-400">AI Confidence</p>
                             <p className="text-4xl font-bold text-primary-purple">{forecast.confidence}</p>
                        </Card>
                    </div>
                    <Card className="p-6">
                        <h3 className="text-xl font-bold mb-4 text-white">
                            Forecast for "{forecast.assetTitle}" (Next {forecast.forecastPeriod} Months)
                        </h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <AreaChart data={forecast.data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="month" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" tickFormatter={(value) => `${numberFormatter.format(value)}`} />
                                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                                <Legend />
                                <Area type="monotone" dataKey="pessimistic" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} name="Pessimistic" />
                                <Area type="monotone" dataKey="projected" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="Projected" />
                                <Area type="monotone" dataKey="optimistic" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.2} name="Optimistic" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>
                    <Card className="p-6 bg-dark-bg/50">
                         <div className="flex items-start space-x-3">
                            <div className="text-primary-purple mt-1 flex-shrink-0 text-lg"><SharedIcons.AIAssistant /></div>
                            <div>
                                <h4 className="text-md font-bold text-white">AI Strategic Insight</h4>
                                <p className="text-sm text-gray-300 italic">"{forecast.insight}"</p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default ForecastingPage;