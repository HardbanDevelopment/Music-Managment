// FIX: This file was a placeholder. Added page implementation.
import React from 'react';
import Card from '../../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';

const royaltyData = [
    { month: 'Jan', earnings: 4250 },
    { month: 'Feb', earnings: 3900 },
    { month: 'Mar', earnings: 5100 },
    { month: 'Apr', earnings: 4800 },
    { month: 'May', earnings: 5500 },
    { month: 'Jun', earnings: 6200 },
];

const statements = [
    { id: 'stmt-005', month: 'May 2024', amount: 5500, status: 'Paid' },
    { id: 'stmt-004', month: 'April 2024', amount: 4800, status: 'Paid' },
    { id: 'stmt-003', month: 'March 2024', amount: 5100, status: 'Paid' },
    { id: 'stmt-002', month: 'February 2024', amount: 3900, status: 'Paid' },
    { id: 'stmt-001', month: 'January 2024', amount: 4250, status: 'Paid' },
];

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];


const Royalties: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-gradient-to-br from-green-500 to-teal-500 text-white">
                    <p className="text-sm">Lifetime Earnings</p>
                    <p className="text-4xl font-bold">$125,680</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                    <p className="text-sm">Last Month's Earnings</p>
                    <p className="text-4xl font-bold">$6,200</p>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <p className="text-sm">Next Payout</p>
                    <p className="text-4xl font-bold">$5,850</p>
                    <p className="text-xs opacity-80">on July 15, 2024</p>
                </Card>
            </div>

            <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 text-white">Earnings Trend (Last 6 Months)</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={royaltyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                        <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                        <Bar dataKey="earnings" name="Monthly Earnings">
                            {royaltyData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <Card className="p-6">
                 <h3 className="text-xl font-bold mb-4 text-white">Royalty Statements</h3>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-dark-border">
                        <thead className="bg-dark-bg">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Statement Period</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">Status</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Download</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                            {statements.map(stmt => (
                                <tr key={stmt.id} className="hover:bg-dark-bg">
                                    <td className="px-6 py-4 text-sm font-medium text-white">{stmt.month}</td>
                                    <td className="px-6 py-4 text-sm text-gray-300">${stmt.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm text-success-green">{stmt.status}</td>
                                    <td className="px-6 py-4 text-right text-sm"><button className="text-primary-purple hover:underline">Download</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Royalties;
