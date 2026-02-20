import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: any;
}

const Card: React.FC<CardProps> = ({ children, className , onClick }) => {
    return (
        <div onClick={onClick} className={`bg-neutral-900 rounded-lg p-4 ${className ?? ''}`}>
            {children}
        </div>
    );
};

export default Card;
