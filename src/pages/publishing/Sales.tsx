import React, { useEffect, useState, useContext } from 'react';
import Card from '@/components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getBookSalesData, getPublishingData } from '@/services/api';
import { ToastContext } from '@/context/AuthContext';

const Sales: React.FC = () => {
    const { addToast } = useContext(ToastContext);
    const [salesData, setSalesData] = useState<any[]>([]);
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const [sales, pub] = await Promise.all([getBookSalesData(), getPublishingData()]);
                if (!mounted) return;
                setSalesData(sales);
                setBooks(pub.books);
            } catch (e: any) {
                addToast(`Nie udało się pobrać danych sprzedaży: ${e.message || e}`, 'error');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [addToast]);

    const totalRevenue = books.reduce((acc, b) => acc + b.revenue, 0);

    if (loading) {
        return <div className="h-48 w-full flex items-center justify-center text-gray-300">Ładowanie sprzedaży...</div>;
    }
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                    <p className="text-sm">Total Revenue</p>
                    <p className="text-4xl font-bold">${totalRevenue.toLocaleString()}</p>
                </Card>
                 <Card className="p-6 bg-gradient-to-br from-teal-500 to-green-500 text-white">
                    <p className="text-sm">Units Sold (Last 30 days)</p>
                    <p className="text-4xl font-bold">1,247</p>
                </Card>
                 <Card className="p-6 bg-gradient-to-br from-pink-500 to-purple-500 text-white">
                    <p className="text-sm">Top Store</p>
                    <p className="text-4xl font-bold">Amazon KDP</p>
                </Card>
            </div>

            <Card className="p-6">
                 <h3 className="text-xl font-bold mb-4 text-white">Sales by Store (Last 6 Months)</h3>
                <ResponsiveContainer width="100%" height={400}>
                     <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                        <Legend />
                        <Bar dataKey="amazon" stackId="a" fill="#F59E0B" name="Amazon KDP" />
                        <Bar dataKey="apple" stackId="a" fill="#A855F7" name="Apple Books" />
                        <Bar dataKey="kobo" stackId="a" fill="#3B82F6" name="Kobo" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default Sales;
