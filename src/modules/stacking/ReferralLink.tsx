'use client';
import React, { use, useEffect, useState } from 'react'
import { Input } from "rizzui";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import Card from '@/components/Card';
import { getReferralsAtLevel } from '@/apis/user';
import Table from '@/components/Table';
type Employee = {
    walletAddress: string;
    referredBy: string;
    nonce: string;
};

type Column = {
    key: keyof Employee;
    label: string;
    width: string;
};
const columns: Column[] = [
    { key: "walletAddress", label: "walletAddress", width: "w-8 sm:32" },
    { key: "referredBy", label: "referredBy", width: "w-12 sm:32" },
    { key: "nonce", label: "nonce", width: "w-16 sm:32" },

]
const ReferralLink = () => {
    const [referralLink, setReferralLink] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [copied, setCopied] = useState(false);
    const [tableData, setTableData] = useState<Employee[]>([]);

    const getLevelData = async () => {
        const response = await getReferralsAtLevel(walletAddress, 1)
        console.log("referrals at level 1", response?.data);
        setTableData(Array.isArray(response?.data) ? response.data : []);
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
        console.log("referralLink", referralLink);
        setReferralLink(referralLink?.referralLink)
        setWalletAddress(referralLink?.walletAddress)
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

                    <div className='cursor-pointer flex items-center justify-center w-1/6 sm:w-1/12 text-xl text-white' onClick={handleCopy}>
                        {copied ? <LuCopyCheck /> : <LuCopy />}
                    </div>
                </div>

            </Card>

            <div className='p-4'>
                <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white mb-4'>
                    Your <span className='text-green-500'>Community</span>
                </p>
                <Table data={tableData} columns={columns} />
            </div>
        </>
    )
}

export default ReferralLink