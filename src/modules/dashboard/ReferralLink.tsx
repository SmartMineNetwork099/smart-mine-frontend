import React, { useState } from 'react'
import Image from 'next/image'
import { Text, Input } from "rizzui";
import { LuCopy, LuCopyCheck } from "react-icons/lu";


const ReferralLink = () => {
    const [referralLink, setReferralLink] = useState('https://example.com/referral?code=12345');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 1000);
    };

    return (
        <>
            <div className='bg-gray-600 p-4 rounded-lg mt-4'>
                <Text className='font-semibold sm:font-bold text-xl sm:text-3xl text-black'>Referral Link</Text>
                <div className='flex items-center justify-center'>
                    <Image
                        src='/undraw_referral.svg'
                        className='w-28 sm:w-40 h-28 sm:h-40'
                        alt="Referral image"
                        width={160}
                        height={160}
                    />
                </div>
                <Text className="text-center text-xs sm:text-sm mt-2 mb-2 font-medium text-black">
                    Refer your friends now and earn money for every signup!
                </Text>
                <div className='flex items-center justify-between rounded-lg border-2 border-black mt-3'>
                    <Input
                        className=' w-11/12 border-e-2 border-black text-gray-300 px-2 focus:outline-none'
                        inputClassName='border-none'
                        value={referralLink} readOnly
                        variant="text"

                    />

                    <div className='cursor-pointer flex items-center justify-center w-1/6 sm:w-1/12 text-xl text-black' onClick={handleCopy}>
                        {copied ? <LuCopyCheck /> : <LuCopy />}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReferralLink