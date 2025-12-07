import React, { useEffect, useState, useContext } from 'react';
import Card from '../../components/ui/Card';
import { getWalletData, getTransactions } from '../../services/api';
import { Transaction, TransactionStatus } from '../../types';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { ToastContext } from '../../context/AuthContext';

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];

const TransactionStatusBadge: React.FC<{ status: TransactionStatus }> = ({ status }) => {
    const statusStyles = {
        [TransactionStatus.CLEARED]: 'bg-green-500/20 text-green-400',
        [TransactionStatus.PENDING]: 'bg-yellow-500/20 text-yellow-400',
        [TransactionStatus.PAID_OUT]: 'bg-blue-500/20 text-blue-400',
        [TransactionStatus.FAILED]: 'bg-red-500/20 text-red-400',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>{status}</span>;
};

const WalletPage: React.FC = () => {
    const { addToast } = useContext(ToastContext);
    const [walletData, setWalletData] = useState<any | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const wallet = await getWalletData();
                const txs = await getTransactions();
                if (!mounted) return;
                setWalletData(wallet);
                setTransactions(txs);
            } catch (e: any) {
                addToast(`Nie udało się pobrać danych finansowych: ${e.message || e}`, 'error');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [addToast]);

    if (loading || !walletData) {
        return <div className="h-48 w-full flex items-center justify-center text-gray-300">Ładowanie finansów...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-green-500 to-teal-500 text-white shadow-lg">
                    <p className="text-sm">Current Balance</p>
                    <p className="text-4xl font-bold">${walletData.currentBalance.toLocaleString()}</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg">
                    <p className="text-sm">Lifetime Earnings</p>
                    <p className="text-4xl font-bold">${walletData.lifetimeEarnings.toLocaleString()}</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                    <p className="text-sm">Next Payout</p>
                    <p className="text-4xl font-bold">${walletData.nextPayoutAmount.toLocaleString()}</p>
                    <p className="text-xs opacity-80">on {walletData.nextPayoutDate}</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <Card className="p-6 lg:col-span-2">
                    <h3 className="text-xl font-bold mb-4 text-white">Earnings Breakdown</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={walletData.earningsBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} label>
                               {walletData.earningsBreakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
                <Card className="p-6 lg:col-span-3">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white">Payout Method</h3>
                        <button className="text-sm text-primary-purple hover:underline">Manage</button>
                    </div>
                    <div className="mt-4 p-4 bg-dark-bg rounded-lg flex items-center justify-between">
                         <div>
                            <p className="font-semibold text-white">Bank Account</p>
                            <p className="text-sm text-gray-400">Wells Fargo **** 1234</p>
                        </div>
                        <button className="bg-primary-purple hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg">
                            Request Payout
                        </button>
                    </div>
                </Card>
            </div>

            <Card>
                <h3 className="text-xl font-bold p-6 text-white">Recent Transactions</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-dark-border">
                        <thead className="bg-dark-bg">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                            {transactions.map((txn) => (
                                <tr key={txn.id} className="hover:bg-dark-bg">
                                    <td className="px-6 py-4 text-sm text-gray-400">{txn.date}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-white">{txn.description}</td>
                                    <td className="px-6 py-4 text-sm text-gray-300">{txn.type}</td>
                                    <td className="px-6 py-4 text-sm"><TransactionStatusBadge status={txn.status} /></td>
                                    <td className={`px-6 py-4 text-sm text-right font-semibold ${txn.amount > 0 ? 'text-success-green' : 'text-error-red'}`}>
                                        {txn.amount > 0 ? '+' : ''}${Math.abs(txn.amount).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default WalletPage;
