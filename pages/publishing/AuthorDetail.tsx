import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAuthorById, getBookSalesData } from '../../services/api';
import Card from '../../components/ui/Card';
import BookCard from '../../components/publishing/BookCard';
import Tabs from '../../components/ui/Tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

const COLORS = ['#6366F1', '#3B82F6', '#10B981'];

const AuthorDetail: React.FC = () => {
    const { authorId } = useParams<{ authorId: string }>();
    const [author, setAuthor] = useState<Author | null>(null);
    const [loadingAuthor, setLoadingAuthor] = useState(true);
    const [salesData, setSalesData] = useState<{ month: string; amazon: number; apple: number; kobo: number; }[]>([]);

    useEffect(() => {
        const fetchAuthor = async () => {
            setLoadingAuthor(true);
            try {
                const fetchedAuthor = await getAuthorById(authorId || '');
                setAuthor(fetchedAuthor);
            } catch (e) {
                console.error("Failed to fetch author:", e);
                setAuthor(null);
            } finally {
                setLoadingAuthor(false);
            }
        };
        fetchAuthor();
    }, [authorId]);
    useEffect(() => {
        const fetchSales = async () => {
            const data = await getBookSalesData();
            setSalesData(data);
        };
        fetchSales();
    }, []);
    const [activeTab, setActiveTab] = useState('overview');

    if (loadingAuthor) {
        return <div className="text-center py-20 text-gray-400">Loading author details...</div>;
    }

    if (!author) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Author not found</h2>
                <Link to="/publishing/authors" className="text-primary-purple hover:underline">
                    Back to Authors
                </Link>
            </div>
        );
    }
    
    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'books', label: 'Books' },
        { id: 'performance', label: 'Performance' },
    ];
    
    return (
        <div className="space-y-8">
            <Link to="/publishing/authors" className="text-sm text-primary-purple hover:underline mb-4 inline-block">&larr; Back to Authors</Link>
            <Card className="p-8 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                <img src={author.avatar} alt={author.name} className="w-48 h-48 rounded-full border-4 border-primary-purple shadow-lg" />
                <div className="text-center md:text-left">
                    <h1 className="text-5xl font-bold text-white">{author.name}</h1>
                    <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-6 text-white">
                        <div className="bg-dark-bg p-3 rounded-lg">
                            <p className="text-sm text-gray-400">Books Published</p>
                            <p className="text-2xl font-bold">{author.booksPublished}</p>
                        </div>
                        <div className="bg-dark-bg p-3 rounded-lg">
                            <p className="text-sm text-gray-400">Total Sales</p>
                            <p className="text-2xl font-bold">{author.totalSales.toLocaleString()}</p>
                        </div>
                        <div className="bg-dark-bg p-3 rounded-lg">
                            <p className="text-sm text-gray-400">Total Revenue</p>
                            <p className="text-2xl font-bold">${author.totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </Card>

            <Tabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} />
            
            <div className="mt-6">
                {activeTab === 'overview' && (
                     <Card className="p-6">
                        <h3 className="text-xl font-bold mb-4 text-white">Performance Overview</h3>
                         <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={author.books.map(b => ({ name: b.title.substring(0, 15) + '...', sales: b.sales }))}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
                                <Bar dataKey="sales" name="Sales">
                                   {author.books.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                )}

                {activeTab === 'books' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {author.books.map(book => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                )}
                
                {activeTab === 'performance' && (
                    <Card className="p-6">
                        <h3 className="text-xl font-bold mb-4 text-white">Sales Trend by Store</h3>
                        <ResponsiveContainer width="100%" height={300}>
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
                )}
            </div>
        </div>
    );
};

export default AuthorDetail;