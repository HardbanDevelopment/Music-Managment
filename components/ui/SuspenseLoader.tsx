import React from 'react';

const SuspenseLoader: React.FC = () => (
    <div className="flex items-center justify-center h-full w-full bg-dark-bg">
        <div className="relative flex items-center justify-center w-24 h-24">
            <div className="absolute inset-0 border-4 border-primary-blue rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-primary-purple rounded-full animate-ping"></div>
            <div className="text-primary-purple text-4xl">
                🚀
            </div>
        </div>
    </div>
);

export default SuspenseLoader;
