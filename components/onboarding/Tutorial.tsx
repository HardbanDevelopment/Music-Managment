import React, { useState } from 'react';
import { Role } from '../../types';
import { SharedIcons } from '../common/Icons';

interface TutorialStep {
    icon: React.ReactNode;
    title: string;
    content: string;
}

const tutorialSteps: Record<Role, TutorialStep[]> = {
    [Role.ADMIN]: [
        {
            icon: <h1 className="text-4xl">👑</h1>,
            title: 'Welcome, Administrator!',
            content: "Here's a quick tour of your dashboard. You have a bird's-eye view of the entire platform.",
        },
        {
            icon: <SharedIcons.Analytics />,
            title: 'Key Metrics Overview',
            content: 'Your main dashboard shows total revenue, streams, and the number of active creators. Use this to monitor platform health at a glance.',
        },
        {
            icon: <div className="flex space-x-2"><SharedIcons.Music /><SharedIcons.Publishing /></div>,
            title: 'Manage Creators',
            content: "Use the 'Music' and 'Publishing' sections in the sidebar to manage artists and authors, view their releases, and track their performance.",
        },
        {
            icon: <SharedIcons.Settings />,
            title: "You're All Set!",
            content: 'Explore the platform and use the powerful tools at your disposal to empower your creators. Enjoy!',
        },
    ],
    [Role.MUSIC_CREATOR]: [
        {
            icon: <h1 className="text-4xl">🎵</h1>,
            title: 'Welcome, Music Creator!',
            content: "Let's get you started with the tools to manage and grow your music career.",
        },
        {
            icon: <SharedIcons.Home />,
            title: 'Your Dashboard',
            content: 'This is your command center. Track your monthly listeners, streams, and revenue. You also get an AI-powered insight to guide your strategy!',
        },
        {
            icon: <SharedIcons.Music />,
            title: 'Manage Your Music',
            content: "Navigate to the 'Music' section to manage your releases, view detailed artist analytics, and check your royalties.",
        },
        {
            icon: <SharedIcons.Campaigns />,
            title: 'Marketing Tools',
            content: 'Supercharge your promotion! Use the "Marketing" section to create Smart Links, generate cover art with AI, and monitor media mentions.',
        },
        {
            icon: <SharedIcons.CreativeStudio />,
            title: "You're Ready to Roll!",
            content: "Start by uploading your first release or creating a marketing campaign. Let's make some hits!",
        },
    ],
    [Role.BOOK_AUTHOR]: [
        {
            icon: <h1 className="text-4xl">📖</h1>,
            title: 'Welcome, Author!',
            content: "We're excited to have you on board. Let's walk through how to manage your publishing career.",
        },
        {
            icon: <SharedIcons.Home />,
            title: 'Your Dashboard',
            content: 'Your dashboard shows your total sales and revenue at a glance. The AI insight helps you identify market opportunities.',
        },
        {
            icon: <SharedIcons.Publishing />,
            title: 'Manage Publishing',
            content: "The 'Publishing' section is where you'll manage your books, view author details, and track sales performance.",
        },
        {
            icon: <SharedIcons.Store />,
            title: 'Global Distribution',
            content: "Check the 'Stores' tab within Publishing to see where your books are live across our global network of retailers.",
        },
        {
            icon: <SharedIcons.CreativeStudio />,
            title: "You're Ready to Publish!",
            content: 'Get started by adding a new book or exploring your sales data. Happy writing!',
        },
    ],
};

interface TutorialProps {
    role: Role;
    onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({ role, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const steps = tutorialSteps[role];
    const step = steps[currentStep];

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onClose();
        }
    };
    
    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-dark-card border border-dark-border rounded-2xl shadow-2xl w-full max-w-lg mx-auto text-white transform animate-slide-up flex flex-col overflow-hidden">
                <div className="p-8 text-center border-b border-dark-border">
                    <div className="w-16 h-16 rounded-full bg-primary-purple/20 flex items-center justify-center mx-auto mb-4 text-primary-purple">
                        {step.icon}
                    </div>
                    <h2 className="text-2xl font-bold">{step.title}</h2>
                    <p className="text-gray-400 mt-2">{step.content}</p>
                </div>

                <div className="p-6 bg-dark-bg/50">
                    <div className="flex justify-between items-center">
                        <button onClick={onClose} className="text-sm text-gray-500 hover:text-white">Skip Tutorial</button>
                        
                        <div className="flex items-center space-x-2">
                            {steps.map((_, index) => (
                                <div key={index} className={`w-2 h-2 rounded-full transition-colors ${index === currentStep ? 'bg-primary-purple' : 'bg-dark-border'}`}></div>
                            ))}
                        </div>

                        <div className="flex space-x-2">
                             {currentStep > 0 && (
                                <button onClick={handlePrev} className="py-2 px-4 rounded-lg bg-dark-border hover:bg-gray-600 text-sm font-semibold">Previous</button>
                            )}
                            <button onClick={handleNext} className="py-2 px-6 rounded-lg bg-primary-purple hover:bg-purple-500 text-sm font-semibold">
                                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tutorial;
