'use client';
import React from "react";
import { ImCross } from "react-icons/im";

type CustomModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
};

const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
};

const CustomModal: React.FC<CustomModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    className = "",
}) => {
    if (!isOpen) return null; // 🔹 don’t render if closed

    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 `}>
            {/* overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose} // close when clicking background
            />

            {/* modal box */}
            <div
                className={`relative bg-white rounded-lg shadow-lg w-full ${sizeClasses[size]} p-6 z-50 ${className}`}
            >
                {/* header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-red-500"
                    >
                        <ImCross className="w-4 h-4" />
                    </button>
                </div>

                {/* body */}
                <div>{children}</div>
            </div>
        </div>
    );
};

export default CustomModal;
