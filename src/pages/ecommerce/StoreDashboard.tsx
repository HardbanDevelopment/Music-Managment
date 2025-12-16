import React, { useEffect, useState, useContext } from 'react';
import Card from '@/components/ui/Card';
import { getProducts, getOrders } from '@/services/api';
import ProductCard from '@/components/ecommerce/ProductCard';
import { Order, OrderStatus } from '@/types';
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


const StoreDashboard: React.FC = () => {
    const { addToast } = useContext(ToastContext);
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const [p, o] = await Promise.all([getProducts(), getOrders()]);
                if (!mounted) return;
                setProducts(p);
                setOrders(o);
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : String(e);
                addToast(`Nie udało się pobrać danych sklepu: ${message}`, 'error');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [addToast]);

    const totalRevenue = orders.reduce((acc, order) => order.status !== 'Cancelled' ? acc + order.total : acc, 0);
    const topProducts = [...products].sort((a, b) => b.sales - a.sales).slice(0, 3);

    if (loading) {
        return <div className="h-48 w-full flex items-center justify-center text-gray-300">Ładowanie sklepu...</div>;
    }
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-green-500 to-teal-500 text-white">
                    <p className="text-sm">Total Revenue</p>
                    <p className="text-4xl font-bold">${totalRevenue.toLocaleString()}</p>
                </Card>
                 <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                    <p className="text-sm">Total Orders</p>
                    <p className="text-4xl font-bold">{orders.length}</p>
                </Card>
                 <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <p className="text-sm">Conversion Rate</p>
                    <p className="text-4xl font-bold">2.5%</p>
                </Card>
            </div>

             <div>
                <h3 className="text-2xl font-bold mb-4 text-white">Top Selling Products</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>

            <Card>
                <h3 className="text-xl font-bold p-6 text-white">Recent Orders</h3>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-dark-border">
                        <thead className="bg-dark-bg">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                            {orders.slice(0, 5).map(order => (
                                <tr key={order.id} className="hover:bg-dark-bg">
                                    <td className="px-6 py-4 text-sm font-medium text-white">{order.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-300">{order.customerName}</td>
                                    <td className="px-6 py-4 text-sm text-gray-300">{order.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-300">${order.total.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm"><OrderStatusBadge status={order.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default StoreDashboard;
