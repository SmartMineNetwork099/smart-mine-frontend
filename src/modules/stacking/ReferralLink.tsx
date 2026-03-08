'use client';
import React, { useEffect, useState } from 'react';
import { Input } from "rizzui";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import Card from '@/components/Card';
import { useWalletAddress } from '@/hooks/useWallet';
import { getUserData } from '@/db/getData';
import { normalizeWalletAddress } from '@/utils/func';

const ReferralLink = () => {
    const [referralLink, setReferralLink] = useState('');
    const [copied, setCopied] = useState(false);
        let walletAddress = useWalletAddress();
           walletAddress = normalizeWalletAddress(walletAddress)
    

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500); // Auto hide after 1.5s
    };
    const generateReferralLink = async (walletAddress: string) => {
      const userData:any = await getUserData(walletAddress);
      console.log(userData,'userData in referral link')
        setReferralLink(userData?.referralLink ?? "");
}
    useEffect(() => {
        if(!walletAddress) return;
        generateReferralLink(walletAddress);
    }, [walletAddress]);

    return (
        <Card className='mt-4'>
            <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white'>
                Referral <span className='text-green-500'>Link</span>
            </p>

            <div className='flex items-center justify-between rounded-lg border-2 border-green-500 mt-3 relative'>
                <Input
                    className='w-11/12 border-e-2 border-green-500 text-gray-300 px-2 focus:outline-none'
                    inputClassName='border-none text-xs sm:text-sm'
                    value={referralLink || " "}
                    readOnly
                    variant="text"
                />

                {/* Copy Button + Tooltip */}
                <div
                    className='cursor-pointer flex items-center justify-center w-1/4 sm:w-1/12 h-[40px] text-xl text-white relative bg-green-500'
                    onClick={handleCopy}
                >
                    <span className='text-2xl'>
                    {copied ? <LuCopyCheck /> : <LuCopy />}
                    </span>

                    {/* ✅ Custom Tooltip */}
                    {copied && (
                        <span className="absolute -top-10 bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-md">
                            Copied!
                        </span>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default ReferralLink;
