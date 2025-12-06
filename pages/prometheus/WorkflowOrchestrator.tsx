
import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import { SharedIcons } from '../../components/common/Icons';

interface Workflow {
    id: string;
    name: string;
    trigger: string;
    actions: string[];
    isActive: boolean;
    lastRun: string | null;
}

const WorkflowCard: React.FC<{ workflow: Workflow, onToggle: (id: string) => void }> = ({ workflow, onToggle }) => (
    <Card className="p-6 border border-dark-border hover:border-primary-purple transition-colors">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${workflow.isActive ? 'bg-success-green/20 text-success-green' : 'bg-gray-700 text-gray-400'}`}>
                    <SharedIcons.Workflow />
                </div>
                <div>
                    <h3 className="font-bold text-white">{workflow.name}</h3>
                    <p className="text-xs text-gray-400">{workflow.isActive ? 'Active' : 'Paused'}</p>
                </div>
            </div>
             <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input 
                    type="checkbox" 
                    name="toggle" 
                    id={`toggle-${workflow.id}`} 
                    checked={workflow.isActive}
                    onChange={() => onToggle(workflow.id)}
                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    style={{ right: workflow.isActive ? 0 : 'auto', left: workflow.isActive ? 'auto' : 0 }}
                />
                <label 
                    htmlFor={`toggle-${workflow.id}`} 
                    className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${workflow.isActive ? 'bg-primary-purple' : 'bg-gray-700'}`}
                ></label>
            </div>
        </div>
        
        <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-300">
                <span className="w-20 font-semibold text-primary-blue">IF THIS:</span>
                <span className="bg-dark-bg px-2 py-1 rounded">{workflow.trigger}</span>
            </div>
            <div className="flex items-start text-sm text-gray-300">
                <span className="w-20 font-semibold text-primary-purple mt-1">THEN THAT:</span>
                <div className="flex-1 space-y-1">
                    {workflow.actions.map((action, i) => (
                        <div key={i} className="bg-dark-bg px-2 py-1 rounded block">
                            {action}
                        </div>
                    ))}
                </div>
            </div>
        </div>
        
        <div className="text-xs text-gray-500 border-t border-dark-border pt-3 flex justify-between">
            <span>Runs automatically</span>
            <span>Last run: {workflow.lastRun || 'Never'}</span>
        </div>
    </Card>
);

const WorkflowOrchestrator: React.FC = () => {
    const [workflows, setWorkflows] = useState<Workflow[]>([
        {
            id: 'wf1',
            name: 'New Release Promo Blast',
            trigger: 'New Release Published',
            actions: ['Post to Instagram', 'Send Email to "Super Fans"', 'Update Bio Link'],
            isActive: true,
            lastRun: '2 days ago'
        },
        {
            id: 'wf2',
            name: 'Merch Store Abandoned Cart',
            trigger: 'Cart Abandoned (> 1hr)',
            actions: ['Send Reminder Email', 'Offer 5% Discount Code'],
            isActive: false,
            lastRun: '1 week ago'
        },
        {
            id: 'wf3',
            name: 'Fan Birthday Wish',
            trigger: 'Fan Birthday = Today',
            actions: ['Send Personalized DM'],
            isActive: true,
            lastRun: '5 hours ago'
        }
    ]);

    const toggleWorkflow = (id: string) => {
        setWorkflows(prev => prev.map(wf => wf.id === id ? { ...wf, isActive: !wf.isActive } : wf));
    };

    return (
        <div className="space-y-8">
             <Card className="p-8 bg-gradient-to-r from-primary-purple/20 to-primary-blue/20 border border-primary-purple/50">
                <div className="flex items-center space-x-4">
                    <div className="text-4xl text-white"><SharedIcons.Workflow /></div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Workflow Orchestrator</h2>
                        <p className="text-gray-300 mt-1">Automate your marketing, distribution, and fan engagement. Connect your tools and let the system work for you.</p>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workflows.map(wf => <WorkflowCard key={wf.id} workflow={wf} onToggle={toggleWorkflow} />)}
                
                <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-2xl hover:border-primary-purple hover:bg-dark-card transition-all group h-full min-h-[250px]">
                    <div className="w-12 h-12 rounded-full bg-gray-700 group-hover:bg-primary-purple flex items-center justify-center mb-4 text-white text-2xl transition-colors">
                        +
                    </div>
                    <span className="font-bold text-gray-400 group-hover:text-white transition-colors">Create Custom Workflow</span>
                </button>
            </div>
        </div>
    );
};

export default WorkflowOrchestrator;
