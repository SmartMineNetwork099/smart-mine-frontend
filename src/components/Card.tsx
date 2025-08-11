import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
    return (
        <div className={`bg-gray-600 rounded-lg p-4 ${className ?? ''}`}>
            {children}
        </div>
    );
};

export default Card;
