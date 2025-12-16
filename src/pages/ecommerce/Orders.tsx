
import React, { useState, useMemo, useEffect, useContext } from 'react';
import { getOrders } from '@/services/api';
import { Order, OrderStatus } from '@/types';
import ResourceTablePage, { Column } from '@/components/common/ResourceTablePage';
import { ToastContext } from '@/context/AuthContext';

const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
    const statusStyles = {
        Processing: 'bg-blue-500/20 text-blue-400',
        Shipped: 'bg-yellow-500/20 text-yellow-400',
        Delivered: 'bg-green-500/20 text-green-400',
        Cancelled: 'bg-red-500/20 text-red-400',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>{status}</span>;
};

const Orders: React.FC = () => {
    const { addToast } = useContext(ToastContext);
    const [orders, setOrders] = useState<Order[]>([]);
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getOrders();
                if (mounted) setOrders(data);
            } catch (e: any) {
                addToast(`Nie udało się pobrać zamówień: ${e.message || e}`, 'error');
            }
        })();
        return () => { mounted = false; };
    }, [addToast]);

    const filteredOrders = useMemo(() => {
        if (statusFilter === 'All') return orders;
        return orders.filter(order => order.status === statusFilter);
    }, [orders, statusFilter]);

    const filterOptions = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    const columns: Column<Order>[] = [
        { header: 'Order ID', render: (o) => <span className="font-medium text-white">{o.id}</span> },
        { header: 'Customer', render: (o) => <span className="text-gray-300">{o.customerName}</span> },
        { header: 'Date', render: (o) => <span className="text-gray-300">{o.date}</span> },
        { header: 'Total', render: (o) => <span className="text-gray-300">${o.total.toFixed(2)}</span> },
        { header: 'Status', render: (o) => <OrderStatusBadge status={o.status} /> },
    ];

    // Empty component for modal as we don't create orders manually in this view yet
    const NoOpModal = ({ onClose }: { onClose: () => void }) => (
        <div className="text-center p-4">
            <p className="mb-4">Order creation is handled via the storefront.</p>
            <button onClick={onClose} className="bg-primary-purple px-4 py-2 rounded">Close</button>
        </div>
    );

    return (
        <ResourceTablePage<Order>
            title="All Orders"
            items={filteredOrders}
            columns={columns}
            searchKeys={['id', 'customerName']}
            searchPlaceholder="Search orders..."
            addNewButtonText="Manual Order" 
            addModalTitle="Create Manual Order"
            addModalContent={(onClose) => <NoOpModal onClose={onClose} />}
            emptyState={{
                icon: <span className="text-4xl">📦</span>,
                title: "No Orders Yet",
                description: statusFilter === 'All' 
                    ? "Your sales history is empty. Promote your store to start receiving orders!" 
                    : `No orders found with the status "${statusFilter}". Try adjusting your filters.`,
                ctaText: "Refresh Orders"
            }}
            filterOptions={{
                label: "Filter by status:",
                options: filterOptions,
                selected: statusFilter,
                onSelect: (val) => setStatusFilter(val as OrderStatus | 'All')
            }}
        />
    );
};

export default Orders;
