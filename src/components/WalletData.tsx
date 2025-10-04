"use client"
import React, { useState, ChangeEvent, useEffect } from 'react'
import Card from '@/components/Card';
import { DEFAULT_CURRENCY } from "@/constants/currency";
import { uploadToCloudinary } from '@/utils/uploadToCloudinary ';
import { getUserData, updateUserImage } from '@/apis/user';
import { toast } from 'react-toastify';
import { getUserIdFromWallet } from '@/utils/walletHelpers';
import { FaRegUser } from "react-icons/fa6";
import { useSearchParams } from 'next/navigation';
import { getSocket, initSocket } from '@/utils/socket';
import { formatAmount } from '@/utils/func';
import Image from 'next/image';

const WalletData = () => {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [walletData, setWalletData] = useState<any>([]);
    const [isMobile, setIsMobile] = useState(false);
    const [userID, setUserID] = useState<string | null>(null);
    const searchParams = useSearchParams();

    // Handle Image Upload
    const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
            const imageUrl1 = await uploadToCloudinary(file);
            if (!imageUrl1) return toast.error("Image upload failed. Please try again.");
            if (!userID) return toast.error("User not found. Please login again.");
            const imageSaveInDB = await updateUserImage(userID, imageUrl1);
            toast.success("Image uploaded successfully!");
            setProfileImage(imageSaveInDB?.data?.image_url || imageUrl);
            const getUser = await getUserData(userID);
            localStorage.setItem(`walletData_${userID}`, JSON.stringify(getUser?.data?.user));
        }
    };
    // Fetch user data by id (idParam overrides current state userID)
    const handleWalletDataFetch = async (idParam?: string | null) => {
        const id = idParam ?? userID;
        console.log(id, 'ididididid')
        if (!id) return;
        try {
            const res = await getUserData(id);
            const user = res?.data?.user || {};
            setWalletData(user);
            setProfileImage(user?.image_url || null);
            localStorage.setItem(`walletData_${id}`, JSON.stringify(user));
        } catch (err) {
            console.error("Failed to fetch user data:", err);
            toast.error("Failed to load user data");
        }
    };

    // Init: prefer localStorage, fallback to URL param; listen to storage events
    useEffect(() => {
        const init = async () => {
            let id = getUserIdFromWallet();

            if (!id) {
                const urlId = searchParams?.get("userId");
                if (urlId) {
                    id = urlId;
                    // save back to localStorage for future reads
                    try {
                        localStorage.setItem("userID", urlId);
                    } catch (err) {
                        console.warn("Couldn't write userID to localStorage", err);
                    }
                }
            }

            setUserID(id);
            if (id) {
                await handleWalletDataFetch(id);
            }
        };

        init();
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
        { name: 'Today Income', transactions: `${formatAmount(walletData?.wallet?.todayIncome || 0)} $` },
        { name: 'Total Income', transactions: `${formatAmount(walletData?.wallet?.balance || 0)} $` },
        { name: 'Total Deposit', transactions: `${formatAmount(walletData?.wallet?.totalDeposit || 0)} $` },
        { name: 'Total Withdraw', transactions: `${formatAmount(walletData?.wallet?.totalWithdraw || 0)} $` },
    ];
    console.log(walletData, 'walletDatawalletDatawalletData')

    useEffect(() => {
        // ✅ Ensure socket is always initialized here
        initSocket(userID);
        const socket = getSocket();
        if (!socket) {
            console.warn("⚠️ Socket not initialized yet");
            return;
        }

        // ✅ Wait until socket is connected before attaching listeners
        const handleConnect = () => {
            console.log("🔌 Socket connected in CollectCoins, attaching wallet listener...");
            if (userID) {
                socket.on('walletUpdated', (data: any) => {
                    console.log("💰 Wallet update received:", data);
                    setWalletData(data);
                });
            }
        };

        if (socket.connected) {
            handleConnect();
        } else {
            socket.on('connect', handleConnect);
        }

        return () => {
            socket.off('walletUpdated');
            socket.off('connect', handleConnect);
        };
    }, [userID]);

    return (
        <>
            <Card className="flex flex-col flex-grow">
                <div className="rounded-2xl text-white">
                    <div className='flex gap-1 sm:gap-2'>
                        {/* Profile Image Upload */}
                        <div className="flex justify-center">
                            <label className="cursor-pointer relative">
                                {profileImage ? (
                                    <Image
                                        src={profileImage || "/default-avatar.png"}
                                        alt="User"
                                        className="rounded-full border-2 border-gray-500 hover:opacity-80 transition h-[56px] w-[56px]"
                                        width={56}
                                        height={64}
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
                        <div className="text-[10px] sm:text-sm text-gray-300 flex flex-col justify-center">
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

                <div className='shadow-2xl rounded py-2 px-0.5 grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-4'>
                    {walletInfo?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between px-2 sm:px-3 py-2.5 sm:py-4 bg-black text-white rounded-lg">
                            <div className=''>
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