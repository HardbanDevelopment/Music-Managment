
import React from 'react';

const ComingSoonPage: React.FC<{ title: string }> = ({ title }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
            <div className="p-12 bg-dark-card border border-dark-border rounded-2xl shadow-2xl">
                <h1 className="text-5xl font-bold text-primary-purple mb-4">{title}</h1>
                <p className="text-2xl text-white">Coming Soon!</p>
                <p className="text-gray-400 mt-2">This feature is currently under construction. Stay tuned!</p>
                <div className="mt-8 text-6xl animate-bounce">🚀</div>
            </div>
        </div>
    );
};

export default ComingSoonPage;
