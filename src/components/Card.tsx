import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: any;
}

const Card: React.FC<CardProps> = ({ children, className , onClick }) => {
    return (
        <div onClick={onClick} className={`bg-white/10 backdrop-blur-sm  rounded-lg px-3 py-4 ${className ?? ''}`}>
            {children}
        </div>
    );
};

export default Card;
