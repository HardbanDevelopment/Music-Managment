import React from 'react';
import { CollaborationProject, CollaborationProjectStatus } from '../../types';
import Card from '../ui/Card';

const ProjectStatusBadge: React.FC<{ status: CollaborationProjectStatus }> = ({ status }) => {
    const statusStyles = {
        [CollaborationProjectStatus.OPEN]: 'bg-green-500/20 text-green-400',
        [CollaborationProjectStatus.IN_PROGRESS]: 'bg-blue-500/20 text-blue-400',
        [CollaborationProjectStatus.COMPLETED]: 'bg-gray-500/20 text-gray-400',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>{status}</span>;
};

interface CollaborationProjectCardProps {
    project: CollaborationProject;
}

const CollaborationProjectCard: React.FC<CollaborationProjectCardProps> = ({ project }) => {
    return (
        <Card className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
                <ProjectStatusBadge status={project.status} />
            </div>
            <p className="text-xs text-gray-500 mb-4">by {project.creatorName}</p>
            
            <p className="text-sm text-gray-400 flex-grow">{project.description}</p>

            <div className="mt-4">
                <h4 className="text-sm font-semibold text-white mb-2">Roles Needed:</h4>
                <div className="flex flex-wrap gap-2">
                    {project.rolesNeeded.map(role => (
                        <span key={role} className="px-3 py-1 text-xs font-semibold rounded-full bg-primary-purple/20 text-primary-purple">
                            {role}
                        </span>
                    ))}
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-dark-border">
                <button className="w-full bg-primary-blue hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-lg">
                    View & Apply
                </button>
            </div>
        </Card>
    );
};

export default CollaborationProjectCard;