import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Role } from '../types';
import Card from '../components/ui/Card';

const OnboardingPage: React.FC = () => {
    const { login } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center text-white p-4">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold tracking-wider">
                    Hardban<span className="text-primary-purple">Records</span>
                </h1>
                <p className="text-gray-400 mt-2">The all-in-one platform for modern creators.</p>
            </div>
            
            <Card className="p-8 md:p-12 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-8">Choose Your Role to Login</h2>
                <div className="space-y-4">
                    <button
                        onClick={() => login(Role.ADMIN)}
                        className="w-full text-left flex items-center space-x-4 p-4 rounded-lg bg-dark-bg hover:bg-primary-purple/20 transition-colors"
                    >
                        <span className="text-3xl">👑</span>
                        <div>
                            <p className="font-bold">Administrator</p>
                            <p className="text-sm text-gray-400">Oversee all operations.</p>
                        </div>
                    </button>
                    <button
                        onClick={() => login(Role.MUSIC_CREATOR)}
                        className="w-full text-left flex items-center space-x-4 p-4 rounded-lg bg-dark-bg hover:bg-primary-purple/20 transition-colors"
                    >
                        <span className="text-3xl">🎵</span>
                        <div>
                            <p className="font-bold">Music Creator</p>
                            <p className="text-sm text-gray-400">Manage your releases and royalties.</p>
                        </div>
                    </button>
                    <button
                        onClick={() => login(Role.BOOK_AUTHOR)}
                        className="w-full text-left flex items-center space-x-4 p-4 rounded-lg bg-dark-bg hover:bg-primary-purple/20 transition-colors"
                    >
                        <span className="text-3xl">📖</span>
                        <div>
                            <p className="font-bold">Book Author</p>
                            <p className="text-sm text-gray-400">Track your book sales and distribution.</p>
                        </div>
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default OnboardingPage;
