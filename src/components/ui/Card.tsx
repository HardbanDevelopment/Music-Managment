
import React from 'react';

interface CardProps {
    // FIX: Make children optional to allow for empty cards used as skeletons.
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
    const baseClasses = "bg-dark-card border border-dark-border rounded-2xl shadow-lg transition-all duration-300";
    const hoverClasses = onClick ? "hover:shadow-primary-purple/20 hover:-translate-y-1 cursor-pointer" : "";
    
    return (
        <div className={`${baseClasses} ${hoverClasses} ${className}`} onClick={onClick}>
            {children}
        </div>
    );
};

export default Card;
