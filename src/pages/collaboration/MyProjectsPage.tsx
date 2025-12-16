import React, { useState, useContext, useMemo, useEffect } from 'react';
import { getCollaborationProjects } from '@/services/api';
import { CollaborationProject } from '@/types';
import { AuthContext } from '@/context/AuthContext';
import ResourceListPage from '@/components/common/ResourceListPage';
import CollaborationProjectCard from '@/components/collaboration/CollaborationProjectCard';
import AddProjectForm from '@/components/collaboration/AddProjectForm';

const MyProjectsPage: React.FC = () => {
    const { user } = useContext(AuthContext);
    const [allProjects, setAllProjects] = useState<CollaborationProject[]>([]);

    useEffect(() => {
        let mounted = true;
        (async () => {
            const data = await getCollaborationProjects();
            if (mounted) setAllProjects(data);
        })();
        return () => { mounted = false; };
    }, []);

    const myProjects = useMemo(() => {
        if (!user) return [];
        return allProjects.filter(p => p.creatorId === user.id);
    }, [allProjects, user]);
    
    const handleProjectAdded = (newProject: CollaborationProject) => {
        setAllProjects(prev => [newProject, ...prev]);
    };

    if (!user) {
        return null;
    }

    return (
        <ResourceListPage<CollaborationProject>
            items={myProjects}
            renderItem={(project, _isSelected, _onSelect) => (
                <CollaborationProjectCard project={project} />
            )}
            searchKeys={['title', 'description']}
            searchPlaceholder="Search your projects..."
            addNewButtonText="New Project"
            addModalTitle="Create New Collaboration Project"
            addModalContent={(onClose) => (
                <AddProjectForm
                    onProjectAdded={handleProjectAdded}
                    onClose={onClose}
                />
            )}
            emptyState={{
                icon: <>📁</>,
                title: "Start Collaborating",
                description: "You haven't created any projects yet. Launch a new project to find the perfect collaborators for your next big idea.",
                ctaText: "+ Create New Project",
            }}
            gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        />
    );
};

export default MyProjectsPage;
