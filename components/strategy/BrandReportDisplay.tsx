import React from 'react';
import { BrandReport } from '../../types';
import Card from '../ui/Card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell, Tooltip } from 'recharts';

const SENTIMENT_COLORS = {
    positive: '#10B981',
    neutral: '#6B7280',
    negative: '#EF4444',
};

const SwotQuadrant: React.FC<{ title: string; items: string[]; color: string; }> = ({ title, items, color }) => (
    <div className={`p-4 rounded-lg bg-dark-bg/50 border-t-4 ${color}`}>
        <h4 className="font-bold text-white mb-2">{title}</h4>
        <ul className="space-y-1.5 list-disc list-inside">
            {items.map((item, index) => (
                <li key={index} className="text-sm text-gray-300">{item}</li>
            ))}
        </ul>
    </div>
);

const BrandReportDisplay: React.FC<{ report: BrandReport }> = ({ report }) => {
    const sentimentData = [
        { name: 'Positive', value: report.sentiment.positiveScore, fill: SENTIMENT_COLORS.positive },
        { name: 'Neutral', value: report.sentiment.neutralScore, fill: SENTIMENT_COLORS.neutral },
        { name: 'Negative', value: report.sentiment.negativeScore, fill: SENTIMENT_COLORS.negative },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="p-6 lg:col-span-2">
                    <h3 className="text-xl font-bold text-white mb-4">Public Sentiment Analysis</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={sentimentData} layout="vertical" margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                            <XAxis type="number" domain={[0, 100]} hide />
                            <YAxis type="category" dataKey="name" stroke="#9CA3AF" width={80} axisLine={false} tickLine={false} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                                formatter={(value: number) => `${value.toFixed(0)}%`}
                            />
                            <Bar dataKey="value" barSize={30} radius={[0, 5, 5, 0]}>
                                {sentimentData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="p-3 bg-dark-bg rounded-lg">
                            <h4 className="text-sm font-semibold text-success-green">Key Positive Topics</h4>
                            <ul className="text-xs text-gray-400 mt-1 list-disc list-inside">
                                {report.sentiment.keyPositiveTopics.map((topic, i) => <li key={i}>{topic}</li>)}
                            </ul>
                        </div>
                        <div className="p-3 bg-dark-bg rounded-lg">
                            <h4 className="text-sm font-semibold text-error-red">Key Negative Topics</h4>
                             <ul className="text-xs text-gray-400 mt-1 list-disc list-inside">
                                {report.sentiment.keyNegativeTopics.map((topic, i) => <li key={i}>{topic}</li>)}
                            </ul>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 flex flex-col justify-center items-center text-center bg-gradient-to-br from-primary-purple to-primary-indigo">
                    <p className="text-sm text-indigo-200">Identified Brand Archetype</p>
                    <h3 className="text-4xl font-bold text-white mt-2">{report.archetype.name}</h3>
                    <p className="text-xs text-indigo-200 mt-2">{report.archetype.description}</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                        {report.archetype.keywords.map(kw => (
                            <span key={kw} className="px-2 py-0.5 text-xs font-semibold rounded-full bg-white/20 text-white">{kw}</span>
                        ))}
                    </div>
                </Card>
            </div>
            
            <Card className="p-6">
                 <h3 className="text-xl font-bold text-white mb-4">Strategic SWOT Analysis</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SwotQuadrant title="Strengths" items={report.swot.strengths} color="border-success-green" />
                    <SwotQuadrant title="Weaknesses" items={report.swot.weaknesses} color="border-error-red" />
                    <SwotQuadrant title="Opportunities" items={report.swot.opportunities} color="border-primary-blue" />
                    <SwotQuadrant title="Threats" items={report.swot.threats} color="border-warning-yellow" />
                 </div>
            </Card>
        </div>
    );
};

export default BrandReportDisplay;