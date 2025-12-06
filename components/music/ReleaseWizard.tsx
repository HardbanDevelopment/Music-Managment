// FIX: This was a placeholder file. Implemented a basic ReleaseWizard component.
import React, { useState } from 'react';
import { MusicRelease } from '../../types';

interface ReleaseWizardProps {
    onComplete: (release: Partial<MusicRelease>) => void;
    onClose: () => void;
}

const ReleaseWizard: React.FC<ReleaseWizardProps> = ({ onComplete, onClose }) => {
    const [step, setStep] = useState(1);
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [status, setStatus] = useState<'Published' | 'Pending' | 'Draft'>('Draft');

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = () => {
        onComplete({ title, artist, status });
        onClose();
    };

    return (
        <div className="space-y-6 text-white">
            {step === 1 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold">Step 1: Release Details</h3>
                    <div>
                        <label className="text-sm">Release Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full mt-1 bg-dark-bg p-2 rounded-md border border-dark-border" />
                    </div>
                    <div>
                        <label className="text-sm">Artist Name</label>
                        <input type="text" value={artist} onChange={e => setArtist(e.target.value)} className="w-full mt-1 bg-dark-bg p-2 rounded-md border border-dark-border" />
                    </div>
                    <div className="flex justify-end pt-4">
                        <button onClick={handleNext} disabled={!title || !artist} className="bg-primary-purple py-2 px-6 rounded-lg disabled:opacity-50">Next</button>
                    </div>
                </div>
            )}
            {step === 2 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-bold">Step 2: Confirmation</h3>
                    <p>You are about to create a draft for "<strong>{title}</strong>" by <strong>{artist}</strong>.</p>
                     <div>
                        <label className="text-sm">Initial Status</label>
                        <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full mt-1 bg-dark-bg p-2 rounded-md border border-dark-border">
                            <option>Draft</option>
                            <option>Pending</option>
                        </select>
                    </div>
                    <div className="flex justify-between pt-4">
                         <button onClick={handleBack} className="bg-dark-border py-2 px-6 rounded-lg">Back</button>
                        <button onClick={handleSubmit} className="bg-success-green py-2 px-6 rounded-lg">Create Release</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReleaseWizard;
