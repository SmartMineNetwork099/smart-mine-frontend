"use client"
import React, { useState, ChangeEvent, useEffect } from 'react'
import Card from '@/components/Card';
import { DEFAULT_CURRENCY } from "@/constants/currency";
import { uploadToCloudinary } from '@/utils/uploadToCloudinary ';
import { getUserData, updateUserImage } from '@/apis/user';
import { toast } from 'react-toastify';
import { getUserIdFromWallet } from '@/utils/walletHelpers';
import { FaRegUser } from "react-icons/fa6";

const walletInfo = [
    {
        name: 'Today Income',
        transactions: '0.001234 USD',
    },
    {
        name: 'Total Income',
        transactions: '0.03736 USD',
    },
    {
        name: 'Total Deposit',
        transactions: '0.6374 USD',
    },
    {
        name: 'Total Withdraw',
        transactions: '0.6374 USD',
    },

];
const WalletData = () => {
    const [profileImage, setProfileImage] = useState<string | null>(null);

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
            const userID = getUserIdFromWallet()
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
    useEffect(() => {
        const walletDataString = localStorage.getItem("walletData");
        const walletData = walletDataString ? JSON.parse(walletDataString) : null;
        setProfileImage(walletData?.image_url || null);
    }, []);
    return (
        <>
            <Card className="flex flex-col  flex-grow">
                {/* //////////////////////////////////// */}
                <div className="rounded-2xl text-white">
                    <div className='flex gap-2'>
                        {/* Profile Image Upload */}
                        <div className="flex justify-center">
                            <label className="cursor-pointer relative">
                                {
                                    profileImage ? (
                                        <img
                                            src={profileImage || "/default-avatar.png"}
                                            alt="User"
                                            className="w-14 sm:w-16 h-14 sm:h-16 rounded-full border-2 border-gray-500 hover:opacity-80 transition"
                                        />
                                    ) : (

                                        <FaRegUser className="w-14 sm:w-16 h-14 sm:h-16 rounded-full border-2 border-gray-500 p-1 hover:opacity-80 transition"
                                        />
                                    )
                                }


                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        {/* User Info */}
                        <div className=" mb-4">
                            <p className="text-gray-300 text-xs sm:text-sm">User ID: <span>HX595415500002</span></p>
                            <p className="text-gray-300 text-xs sm:text-sm">Refer By: <span>HX1872963477</span></p>
                            <p className="text-gray-300 text-xs sm:text-sm">Address: <span>0x706...06c99</span></p>
                        </div>
                    </div>
                </div>

                {/* //////////////////////////////////// */}
                <div className='shadow-2xl rounded py-2 px-0.5 flex flex-col gap-2'>
                    {walletInfo?.map((item: { name: string; transactions: string }, index: number) => (
                        <div key={index} className="flex items-center justify-between p-1 bg-black text-white rounded">
                            <div className=''>
                                <p className="font-medium p-1 text-gray-300 text-sm sm:text-base">
                                    {item?.name}
                                </p>
                            </div>
                            <div className=" sm:w-auto text-left">
                                <p className="font-bold text-green-500 rounded-lg py-1 px-4 text-sm sm:text-base inline sm:block">
                                    {item.transactions.includes(DEFAULT_CURRENCY) ? (
                                        <>
                                            {item?.transactions.replace(DEFAULT_CURRENCY, '')}{' '}
                                            <span className="font-bold">{DEFAULT_CURRENCY}</span>
                                        </>
                                    ) : (
                                        item?.transactions
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