import React, { useState, useContext, useMemo, useEffect } from 'react';
import Card from '../../components/ui/Card';
import { getCollaborationProjects } from '../../services/api';
import { CollaborationProject } from '../../types';
import { ToastContext } from '../../context/AuthContext';
import CollaborationProjectCard from '../../components/collaboration/CollaborationProjectCard';
import Modal from '../../components/ui/Modal';
import AddProjectForm from '../../components/collaboration/AddProjectForm';

const ProjectFinderPage: React.FC = () => {
    const { addToast } = useContext(ToastContext);
    const [projects, setProjects] = useState<CollaborationProject[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getCollaborationProjects();
                if (mounted) setProjects(data);
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : String(e);
                addToast(`Nie udało się pobrać projektów: ${message}`, 'error');
            }
        })();
        return () => { mounted = false; };
    }, [addToast]);

    const handleProjectAdded = (newProject: CollaborationProject) => {
        setProjects(prev => [newProject, ...prev]);
    };

    const filteredProjects = useMemo(() => {
        return projects.filter(p => 
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.rolesNeeded.some(r => r.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [projects, searchTerm]);

    return (
        <div className="space-y-6">
            <Card className="p-4">
                <div className="flex justify-between items-center">
                    <input 
                        type="text" 
                        placeholder="Search by title, role, or keyword..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="bg-dark-bg border border-dark-border rounded-lg p-2 text-sm w-80"
                    />
                    <button onClick={() => setIsModalOpen(true)} className="bg-primary-purple hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg">
                        + Create Project
                    </button>
                </div>
            </Card>
            {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map(project => (
                        <CollaborationProjectCard key={project.id} project={project} />
                    ))}
                </div>
            ) : (
                 <div className="text-center py-16 px-6 bg-dark-card rounded-2xl border border-dashed border-dark-border">
                    <div className="w-16 h-16 rounded-full bg-dark-bg flex items-center justify-center mx-auto mb-4 text-primary-purple text-3xl">🤝</div>
                    <h3 className="text-xl font-bold text-white">Find Your Next Collaboration</h3>
                    <p className="text-gray-400 mt-2 max-w-md mx-auto">
                        {searchTerm 
                            ? `We couldn't find any projects matching "${searchTerm}". Try a different keyword.` 
                            : "The collaboration board is currently empty. Be the spark and start a new project to find talented creators!"}
                    </p>
                    {!searchTerm && (
                        <div className="mt-6">
                            <button onClick={() => setIsModalOpen(true)} className="bg-primary-purple hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all">
                                + Create New Project
                            </button>
                        </div>
                    )}
                </div>
            )}


             <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create New Collaboration Project"
            >
                <AddProjectForm 
                    onProjectAdded={handleProjectAdded}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default ProjectFinderPage;
