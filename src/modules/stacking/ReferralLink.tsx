'use client';
import React, { use, useEffect, useState } from 'react'
import { Input } from "rizzui";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import Card from '@/components/Card';
import { getReferralsAtLevel } from '@/apis/user';


const ReferralLink = () => {
    const [referralLink, setReferralLink] = useState('xxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    const [copied, setCopied] = useState(false);

    const getLevelData = async () => {
        const response = await getReferralsAtLevel('0x51efAf6b1512d0318B6E7240F9977acFDf7456a0', 1)
        console.log("referrals at level 1", response);
    }
    const handleCopy = () => {
        getLevelData();

        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };
    useEffect(() => {
        const walletDataString = localStorage.getItem("walletData");
        const referralLink = walletDataString ? JSON.parse(walletDataString) : null;
        setReferralLink(referralLink?.referralLink)
    }, [])

    return (
        <>
            <Card className=' mt-4'>
                <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white'>Referral <span className='text-green-500'>Link</span></p>
                <div className='flex items-center justify-between rounded-lg border-2 border-green-500 mt-3'>
                    <Input
                        className=' w-11/12 border-e-2 border-green-500 text-gray-300 px-2 focus:outline-none'
                        inputClassName='border-none'
                        value={referralLink} readOnly
                        variant="text"

                    />

                    <div className='cursor-pointer flex items-center justify-center w-1/6 sm:w-1/12 text-xl text-white border border-red-500' onClick={handleCopy}>
                        {copied ? <LuCopyCheck /> : <LuCopy />}
                    </div>
                </div>

            </Card>
        </>
    )
}

export default ReferralLink