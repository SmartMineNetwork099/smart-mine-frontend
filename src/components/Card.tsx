import React from 'react'

const Card = ({ children, className }: any) => {
    return (
        <>
            <div className={`bg-gray-600 rounded-lg p-4 ${className}`}>
                {children}
            </div>
        </>
    )
}

export default Card