import React, { useEffect, useState, useContext } from 'react';
import { Store } from '../../types';
import Card from '../../components/ui/Card';
import { getPublishingStores } from '../../services/api';
import { ToastContext } from '../../context/AuthContext';

const StatusIndicator: React.FC<{ status: string }> = ({ status }) => {
    const baseClasses = "w-2 h-2 rounded-full";
    const colorClass = status === 'Live' ? "bg-success-green" : "bg-warning-yellow";
    return <div className={`${baseClasses} ${colorClass}`}></div>;
};

const Stores: React.FC = () => {
    const { addToast } = useContext(ToastContext);
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getPublishingStores();
                if (mounted) setStores(data);
            } catch (e: unknown) {
                addToast(`Nie udało się pobrać sklepów: ${(e instanceof Error) ? e.message : String(e)}`, 'error');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [addToast]);

    if (loading) {
        return <div className="h-48 w-full flex items-center justify-center text-gray-300">Ładowanie sklepów...</div>;
    }
    return (
        <div className="space-y-6">
             <Card className="p-6">
                 <h2 className="text-2xl font-bold text-white">Publishing Store Distribution</h2>
                 <p className="text-gray-400 mt-1">Monitor the status of your books across 21+ platforms.</p>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {stores.map(store => (
                    <Card key={store.name} className="p-4 flex items-center space-x-4">
                         <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center p-2">
                           <img src={store.logo} alt={store.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-white">{store.name}</p>
                            <div className="flex items-center space-x-2 text-xs">
                                <StatusIndicator status={store.status} />
                                <span className={store.status === 'Live' ? 'text-gray-400' : 'text-warning-yellow'}>
                                    {store.status}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Stores;
