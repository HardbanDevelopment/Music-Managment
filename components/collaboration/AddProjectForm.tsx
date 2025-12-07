import React, { useState, useContext } from 'react';
import { addCollaborationProject } from '../../services/api';
import { CollaborationProject } from '../../types';
import { AuthContext, ToastContext } from '../../context/AuthContext';

interface AddProjectFormProps {
    onProjectAdded: (project: CollaborationProject) => void;
    onClose: () => void;
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({ onProjectAdded, onClose }) => {
    const { user } = useContext(AuthContext);
    const { addToast } = useContext(ToastContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [roles, setRoles] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim() || !roles.trim() || !user) {
            addToast('Please fill out all fields.', 'error');
            return;
        }
        try {
            const newProject = await addCollaborationProject({
                title,
                description,
                rolesNeeded: roles.split(',').map(r => r.trim()),
                revenueSplits: []
            }, { id: user.id, name: user.name });
            onProjectAdded(newProject);
            addToast('Collaboration project created!', 'success');
            setTitle('');
            setDescription('');
            setRoles('');
            onClose();
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            addToast(`Nie udało się utworzyć projektu: ${message}`, 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="text-sm">Project Title</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Seeking Vocalist for Chillwave Track" className="w-full mt-1 bg-dark-bg p-2 rounded-md border border-dark-border" required />
            </div>
             <div>
                <label className="text-sm">Project Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the project, what you're looking for..." rows={4} className="w-full mt-1 bg-dark-bg p-2 rounded-md border border-dark-border" required />
            </div>
             <div>
                <label className="text-sm">Roles Needed</label>
                <input type="text" value={roles} onChange={e => setRoles(e.target.value)} placeholder="e.g., Vocalist, Producer, Lyricist" className="w-full mt-1 bg-dark-bg p-2 rounded-md border border-dark-border" required />
                 <p className="text-xs text-gray-400 mt-1">Separate roles with a comma.</p>
            </div>
            <div className="flex justify-end pt-4 space-x-2">
                <button type="button" onClick={onClose} className="bg-dark-border py-2 px-6 rounded-lg">Cancel</button>
                <button type="submit" className="bg-primary-purple py-2 px-6 rounded-lg">Create Project</button>
            </div>
        </form>
    );
};

export default AddProjectForm;
