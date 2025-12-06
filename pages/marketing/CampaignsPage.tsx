
import React, { useEffect, useState, useContext } from 'react';
import { getCampaigns, addCampaign } from '../../services/api';
import { Campaign, CampaignStatus } from '../../types';
import ResourceTablePage, { Column } from '../../components/common/ResourceTablePage';
import { ToastContext } from '../../context/AuthContext';

const AddCampaignModalContent: React.FC<{ onClose: () => void, onCampaignAdded: (campaign: Campaign) => void }> = ({ onClose, onCampaignAdded }) => {
    const [name, setName] = useState('');
    const [budget, setBudget] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { addToast } = useContext(ToastContext);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newCampaign = await addCampaign({ name, status: 'Planning', budget, startDate, endDate, channels: [] });
            onCampaignAdded(newCampaign);
            addToast('Campaign created successfully!', 'success');
            onClose();
        } catch (e: any) {
            addToast(`Nie udało się utworzyć kampanii: ${e.message || e}`, 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Campaign Name" className="w-full bg-dark-bg border-dark-border rounded-md p-3" />
            <input type="number" value={budget} onChange={e => setBudget(Number(e.target.value))} placeholder="Budget" className="w-full bg-dark-bg border-dark-border rounded-md p-3" />
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} placeholder="Start Date" className="w-full bg-dark-bg border-dark-border rounded-md p-3" />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} placeholder="End Date" className="w-full bg-dark-bg border-dark-border rounded-md p-3" />
            <div className="flex justify-end pt-4">
                <button type="submit" className="bg-primary-purple py-2 px-6 rounded-lg">Create Campaign</button>
            </div>
        </form>
    );
};

const CampaignStatusBadge: React.FC<{ status: CampaignStatus }> = ({ status }) => {
    const statusStyles = {
        Active: 'bg-green-500/20 text-green-400',
        Planning: 'bg-blue-500/20 text-blue-400',
        Completed: 'bg-gray-500/20 text-gray-400',
        Paused: 'bg-yellow-500/20 text-yellow-400',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>{status}</span>;
};

const CampaignsPage: React.FC = () => {
    const { addToast } = useContext(ToastContext);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getCampaigns();
                if (mounted) setCampaigns(data);
            } catch (e: any) {
                addToast(`Nie udało się pobrać kampanii: ${e.message || e}`, 'error');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [addToast]);

    const handleCampaignAdded = (newCampaign: Campaign) => {
        setCampaigns(prev => [newCampaign, ...prev]);
    };
    
    const columns: Column<Campaign>[] = [
        { header: 'Campaign', render: (c) => <span className="font-medium text-white">{c.name}</span> },
        { header: 'Status', render: (c) => <CampaignStatusBadge status={c.status} /> },
        { header: 'Budget', render: (c) => <span className="text-gray-300">${c.budget.toLocaleString()}</span> },
        { header: 'Timeline', render: (c) => <span className="text-gray-300">{c.startDate} - {c.endDate}</span> },
    ];

    if (loading) {
        return <div className="h-48 w-full flex items-center justify-center text-gray-300">Ładowanie kampanii...</div>;
    }
    return (
        <ResourceTablePage<Campaign>
            title="Marketing Campaigns"
            subtitle="Plan, execute, and track your promotional campaigns."
            items={campaigns}
            columns={columns}
            searchKeys={['name']}
            searchPlaceholder="Search campaigns..."
            addNewButtonText="New Campaign"
            addModalTitle="Create New Campaign"
            addModalContent={(onClose) => <AddCampaignModalContent onClose={onClose} onCampaignAdded={handleCampaignAdded} />}
            emptyState={{
                icon: <span className="text-4xl">📢</span>,
                title: "Launch Your Promotion",
                description: "Ready to make some noise? Create a marketing campaign to boost streams, sales, and engagement.",
                ctaText: "+ Start Campaign"
            }}
        />
    );
};

export default CampaignsPage;
