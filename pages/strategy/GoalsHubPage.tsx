import React, { useState, useEffect, useContext } from 'react';
import Card from '../../components/ui/Card';
import { getGoals, addGoal, generateGoalSuggestions, getCreatorDashboardData } from '../../services/api';
import { Goal, GoalStatus, SuggestedTask } from '../../types';
import { AuthContext, ToastContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import SuspenseLoader from '../../components/ui/SuspenseLoader';
import Modal from '../../components/ui/Modal';
import { SharedIcons } from '../../components/common/Icons';

// --- Local Components for this page ---

const GoalStatusBadge: React.FC<{ status: GoalStatus }> = ({ status }) => {
    const statusStyles = {
        [GoalStatus.ON_TRACK]: 'bg-green-500/20 text-green-400',
        [GoalStatus.AT_RISK]: 'bg-yellow-500/20 text-yellow-400',
        [GoalStatus.COMPLETED]: 'bg-blue-500/20 text-blue-400',
        [GoalStatus.NOT_STARTED]: 'bg-gray-500/20 text-gray-400',
    };
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status]}`}>{status}</span>;
};

const TaskItem: React.FC<{ task: SuggestedTask; onToggle: (id: string) => void; }> = ({ task, onToggle }) => (
    <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-dark-bg transition-colors">
        <input 
            type="checkbox" 
            checked={task.isCompleted} 
            onChange={() => onToggle(task.id)}
            className="h-4 w-4 rounded bg-dark-bg border-gray-500 text-primary-purple focus:ring-primary-purple"
        />
        <label className={`flex-1 text-sm ${task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-300'}`}>
            {task.description}
        </label>
        {task.link && <Link to={task.link} className="text-xs text-primary-purple hover:underline">Go &rarr;</Link>}
    </div>
);


const GoalCard: React.FC<{ goal: Goal; onUpdateGoal: (updatedGoal: Goal) => void; }> = ({ goal, onUpdateGoal }) => {
    const handleToggleTask = (taskId: string) => {
        const updatedTasks = goal.suggestedTasks.map(task => 
            task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
        );
        onUpdateGoal({ ...goal, suggestedTasks: updatedTasks });
    };

    return (
        <Card className="p-6 flex flex-col space-y-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-white">{goal.title}</h3>
                    <p className="text-sm text-gray-400">{goal.description}</p>
                </div>
                <GoalStatusBadge status={goal.status} />
            </div>

            <div>
                <div className="flex justify-between text-sm font-semibold mb-1">
                    <span className="text-gray-300">{goal.currentValue}</span>
                    <span className="text-primary-purple">{goal.targetMetric}</span>
                </div>
                <div className="w-full bg-dark-bg rounded-full h-2.5">
                    <div className="bg-primary-purple h-2.5 rounded-full" style={{ width: `${goal.progress}%` }}></div>
                </div>
            </div>

            <div>
                <h4 className="text-sm font-bold text-white mb-2">Action Plan:</h4>
                <div className="space-y-1">
                    {goal.suggestedTasks.map(task => <TaskItem key={task.id} task={task} onToggle={handleToggleTask} />)}
                </div>
            </div>
            <div className="text-xs text-gray-500 pt-2 border-t border-dark-border">
                Due: {new Date(goal.dueDate).toLocaleDateString()}
            </div>
        </Card>
    );
};

// FIX: Destructure `onAdd` from props to make it available within the component.
const AIGoalSuggestions: React.FC<{ onAdd: (goal: Partial<Goal>) => void }> = ({ onAdd }) => {
    const { user } = useContext(AuthContext);
    const [suggestions, setSuggestions] = useState<Partial<Goal>[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchSuggestions = async () => {
            const userData = await getCreatorDashboardData(user.id, user.role) as { stats: unknown };
            const aiSuggestions = await generateGoalSuggestions(user.role, userData.stats);
            setSuggestions(aiSuggestions);
            setIsLoading(false);
        };
        fetchSuggestions();
    }, [user]);

    if (isLoading) {
        return <div className="h-40 flex items-center justify-center"><SuspenseLoader /></div>;
    }

    return (
        <Card className="p-6 bg-gradient-to-r from-primary-purple/10 to-dark-card">
            <div className="flex items-start space-x-4">
                <div className="text-2xl mt-1 text-primary-purple"><SharedIcons.AIStudio /></div>
                <div>
                    <h3 className="text-xl font-bold text-white">AI Goal Suggestions</h3>
                    <p className="text-sm text-gray-400 mb-4">Based on your recent performance, here are some goals you could focus on next.</p>
                </div>
            </div>
            <div className="space-y-3">
                {suggestions.map((s, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-dark-bg rounded-lg">
                        <div>
                            <p className="font-semibold text-white">{s.title}</p>
                            <p className="text-xs text-gray-400">{s.targetMetric}</p>
                        </div>
                        <button onClick={() => onAdd(s)} className="text-sm bg-primary-purple/50 hover:bg-primary-purple text-white font-bold py-1 px-3 rounded-lg text-nowrap">+ Add Goal</button>
                    </div>
                ))}
            </div>
        </Card>
    );
};


// --- Main Page Component ---

const GoalsHubPage: React.FC = () => {
    const { addToast } = useContext(ToastContext);
    const [goals, setGoals] = useState<Goal[]>([]);
    
useEffect(() => {
    const fetchGoals = async () => {
        const fetchedGoals = await getGoals();
        setGoals(fetchedGoals);
    };
    fetchGoals();
}, []);
    const [isLoading, setIsLoading] = useState(false);
    
    const handleAddGoal = async (goalData: Partial<Goal>) => {
        const newGoal = await addGoal(goalData);
        setGoals(prev => [newGoal, ...prev]);
        addToast(`Goal "${newGoal.title}" added!`, 'success');
    };
    
    const handleUpdateGoal = (updatedGoal: Goal) => {
        setGoals(prevGoals => prevGoals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Goals & Strategy Hub</h1>
                <p className="text-gray-400">Turn your data into an actionable plan for success.</p>
            </div>
            
            <AIGoalSuggestions onAdd={handleAddGoal} />

            <div>
                <h2 className="text-2xl font-bold text-white mb-4">Active Goals</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {goals.map(goal => (
                        <GoalCard key={goal.id} goal={goal} onUpdateGoal={handleUpdateGoal} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GoalsHubPage;