'use client'
import React, { useEffect, useState } from 'react'
import Table from '@/components/Table';
import { getReferralsAtLevel } from '@/apis/user';
import Pagination from '@/components/Pagination';
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

const YourCommunity = () => {
    const [tableData, setTableData] = useState<Employee[]>([]);
    const [walletAddress, setWalletAddress] = useState('');
    const [referralLink, setReferralLink] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const walletDataString = localStorage.getItem("walletData");
        const referralLink = walletDataString ? JSON.parse(walletDataString) : null;
        setReferralLink(referralLink?.referralLink)
        setWalletAddress(referralLink?.walletAddress)
    }, [])
    const getLevelData = async (LevelNumber: number = 1) => {
        if (!walletAddress) return; // wait until walletAddress is set
        console.log(walletAddress, 'walletAddresswalletAddresswalletAddress')
        try {
            setLoading(true);
            const response = await getReferralsAtLevel(walletAddress, LevelNumber);
            console.log("referrals at level 1", response?.data);
            setTableData(Array.isArray(response?.data) ? response.data : []);
        } catch (error) {
            console.error("Error fetching referrals:", error);
        }
        finally {
            setLoading(false);
        }

    }
    // call api whenever page or walletAddress change
    useEffect(() => {
        if (walletAddress) {
            getLevelData(page);
        }
    }, [walletAddress, page]);
    console.log(page, 'pagepagepagepage')
    return (
        <div className='p-4'>
            <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white mb-4'>
                Your <span className='text-green-500'>Community</span>
            </p>
            <div className='my-2'>
                <Pagination currentPage={page} totalPages={15} onPageChange={setPage} />
            </div>
            <Table data={tableData} columns={columns} loading={loading} />
        </div>
    )
}

export default YourCommunity
