'use client';
import React, { useState } from 'react'
import { Input } from "rizzui";
import { LuCopy, LuCopyCheck } from "react-icons/lu";


const ReferralLink = () => {
    const [referralLink] = useState('https://example.com/referral?code=12345');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };

    return (
        <>
            <div className='bg-gray-600 p-4 rounded-lg mt-4'>
                <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white'>Referral <span className='text-green-500'>Link</span></p>
                <div className='flex items-center justify-between rounded-lg border-2 border-green-500 mt-3'>
                    <Input
                        className=' w-11/12 border-e-2 border-green-500 text-gray-300 px-2 focus:outline-none'
                        inputClassName='border-none'
                        value={referralLink} readOnly
                        variant="text"

                    />

                    <div className='cursor-pointer flex items-center justify-center w-1/6 sm:w-1/12 text-xl text-white' onClick={handleCopy}>
                        {copied ? <LuCopyCheck /> : <LuCopy />}
                    </div>
                </div>
                
            </div>
        </>
    )
}

export default ReferralLink