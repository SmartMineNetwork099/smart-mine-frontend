'use client';
import React, { useState, useEffect } from 'react'
import Index from '@/modules/admin/index'
import AdminPasswordModal from '@/components/AdminPasswordModal'

const Page = () => {
    const [isPasswordVerified, setIsPasswordVerified] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Show modal on component mount
    useEffect(() => {
        setShowModal(true);
    }, []);

    const handlePasswordVerify = (isCorrect: boolean) => {
        if (isCorrect) {
            setIsPasswordVerified(true);
            setShowModal(false);
        }
    };

    return (
        <>
            {/* Password Modal */}
            <AdminPasswordModal
                isOpen={showModal && !isPasswordVerified}
                onVerify={handlePasswordVerify}
            />

            {/* Show admin content only if password is verified */}
            {isPasswordVerified ? (
                <Index />
            ) : (
                <div className='h-screen flex items-center justify-center'>
                    <p className="text-gray-400 text-lg">Please verify your password to access admin panel</p>
                </div>
            )}
        </>
    )
}

export default Page