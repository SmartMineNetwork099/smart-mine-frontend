"use client"
import React, { useState, ChangeEvent, useEffect } from 'react'
import Card from '@/components/Card';
import { DEFAULT_CURRENCY } from "@/constants/currency";
import { uploadToCloudinary } from '@/utils/uploadToCloudinary ';
import { getUserData, updateUserImage } from '@/apis/user';
import { toast } from 'react-toastify';
import { getUserIdFromWallet } from '@/utils/walletHelpers';
import { FaRegUser } from "react-icons/fa6";

const WalletData = () => {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [walletData, setWalletData] = useState<any>([]);
    const [isMobile, setIsMobile] = useState(false);
    const userID = getUserIdFromWallet()
    // Handle Image Upload
    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
            const imageUrl1 = await uploadToCloudinary(file);
            if (!imageUrl1) {
                toast.error("Image upload failed. Please try again.");
                return;
            }

            if (!userID) {
                toast.error("User not found. Please login again.");
                return;
            }
            const imageSaveInDB = await updateUserImage(userID, imageUrl1);
            toast.success("Image uploaded successfully!");
            setProfileImage(imageSaveInDB?.data?.image_url || imageUrl);
            const getUser = await getUserData(userID);
            localStorage.setItem("walletData", JSON.stringify(getUser?.data?.user));
        }
    };
    const handleWalletDataFetch = async () => {
        // const walletDataString = localStorage.getItem("walletData");
        // const walletData = walletDataString ? JSON.parse(walletDataString) : null;
        const getUser = await getUserData(userID);
        setProfileImage(walletData?.image_url || null);
        setWalletData(getUser?.data?.user || []);
    }
    useEffect(() => {
        handleWalletDataFetch()
    }, []);

    // Detect mobile screen for short address
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 640);
        handleResize(); // Run once on mount
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Generate display address
    const displayAddress = walletData?.walletAddress
        ? isMobile
            ? `${walletData.walletAddress.slice(0, 8)}......${walletData.walletAddress.slice(-8)}`
            : walletData.walletAddress
        : "";


    const walletInfo = [
        { name: 'Today Income', transactions: `${walletData?.wallet?.todayIncome || 0} $` },
        { name: 'Total Income', transactions: `${walletData?.wallet?.balance || 0} $` },
        { name: 'Total Deposit', transactions: `${walletData?.wallet?.totalDeposit || 0} $` },
        { name: 'Total Withdraw', transactions: `${walletData?.wallet?.totalWithdraw || 0} $` },
    ];
    console.log(walletData, 'walletDatawalletDatawalletData')
    return (
        <>
            <Card className="flex flex-col flex-grow">
                <div className="rounded-2xl text-white">
                    <div className='flex gap-1 sm:gap-2'>
                        {/* Profile Image Upload */}
                        <div className="flex justify-center">
                            <label className="cursor-pointer relative">
                                {profileImage ? (
                                    <img
                                        src={profileImage || "/default-avatar.png"}
                                        alt="User"
                                        className="w-12 sm:w-16 h-12 sm:h-16 rounded-full border-2 border-gray-500 hover:opacity-80 transition"
                                    />
                                ) : (
                                    <FaRegUser className="w-12 sm:w-16 h-12 sm:h-16 rounded-full border-2 border-gray-500 p-1 hover:opacity-80 transition" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        {/* User Info */}
                        <div className="mb-4 text-[10px] sm:text-sm text-gray-300">
                            <p>
                                User ID: <span>{walletData?.userId}</span>
                            </p>
                            <p>
                                Refer By: <span>{walletData?.referredBy || '-'}</span>
                            </p>
                            <p>
                                Address: <span>{displayAddress}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className='shadow-2xl rounded py-2 px-0.5 flex flex-col gap-2'>
                    {walletInfo?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between px-2 py-2.5 bg-black text-white rounded-lg">
                            <div>
                                <p className="font-medium text-gray-300 text-sm sm:text-base">
                                    {item.name}
                                </p>
                            </div>
                            <div className="sm:w-auto">
                                <p className="font-bold text-green-500 rounded-lg text-sm sm:text-base inline sm:block">
                                    {item.transactions.includes(DEFAULT_CURRENCY) ? (
                                        <>
                                            {item.transactions.replace(DEFAULT_CURRENCY, '')}{' '}
                                            <span className="font-bold">{DEFAULT_CURRENCY}</span>
                                        </>
                                    ) : (
                                        item.transactions
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </>
    )
}

export default WalletData
