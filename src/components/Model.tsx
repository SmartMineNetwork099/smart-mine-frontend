'use client';
import React from "react";
import { Modal } from "rizzui";

type CustomModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
};

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, title, children,size="md" }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} size={size} className="bg-gray-800 text-white">
            <div className="p-6">
                {title && <h2 className="text-base sm:text-xl font-bold mb-4">{title}</h2>}
                {children}
            </div>
        </Modal>
    );
};

export default CustomModal;
