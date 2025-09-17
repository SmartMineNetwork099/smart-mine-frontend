import React, { useState, ChangeEvent } from 'react'
import Card from '@/components/Card';
import { DEFAULT_CURRENCY } from "@/constants/currency";

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
    const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };
    return (
        <>
            <Card className="flex flex-col  flex-grow">
                {/* //////////////////////////////////// */}
                <div className="rounded-2xl text-white">
                    <div className='flex gap-2'>
                        {/* Profile Image Upload */}
                        <div className="flex justify-center">
                            <label className="cursor-pointer relative">
                                <img
                                    src={profileImage || "/default-avatar.png"}
                                    alt="User"
                                    className="w-14 sm:w-16 h-14 sm:h-16 rounded-full border-2 border-gray-500 hover:opacity-80 transition"
                                />
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
                        <div key={index} className="flex items-center justify-between p-1 shadow-lg text-white rounded">
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