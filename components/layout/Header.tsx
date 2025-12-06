// FIX: This was a placeholder file. Added a functional Header component.
import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Role } from '../../types';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
    const { user } = useContext(AuthContext);

    const formatRole = (role: Role) => {
        return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    };

    return (
        <header className="flex justify-between items-center p-6 bg-dark-bg border-b border-dark-border sticky top-0 z-30">
            <h1 className="text-3xl font-bold text-white">{title}</h1>
            {user && (
                 <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />
                        <div>
                            <p className="font-semibold text-white">{user.name}</p>
                            <p className="text-xs text-gray-400">{formatRole(user.role)}</p>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
