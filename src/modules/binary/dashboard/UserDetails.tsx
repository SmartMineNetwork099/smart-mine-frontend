'use client'
import Card from '@/components/Card';
import React from 'react'
import { DEFAULT_CURRENCY } from "@/constants/currency";


const userData = [
    {
        name: 'My Wallet Fund',
        transactions: '0.001234 USD',
    },
    {
        name: 'User ID',
        transactions: '12345',
    },
    {
        name: 'Rank',
        transactions: 'Hero',
    },
    {
        name: 'Activation Date',
        transactions: '24-03-2023',
    },
    {
        name: 'Referred By',
        transactions: '978675',
    },
];
const UserDetails = () => {

    return (
        <>

            <Card className="flex flex-col gap-4 flex-grow mt-4">
                {userData?.map((item: { name: string; transactions: string }, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className='w-1/2'>
                            <p className="font-medium p-1 text-white text-sm sm:text-base">
                                {item?.name}
                            </p>
                        </div>
                        <div className="w-1/2 sm:w-auto text-left">
                            <p className="font-medium text-green-500 bg-white rounded-lg py-1 px-4 text-sm sm:text-base inline sm:block">
                                {item.transactions.includes(DEFAULT_CURRENCY) ? (
                                    <>
                                        {item?.transactions.replace(DEFAULT_CURRENCY, '')}{' '}
                                        <span className="font-semibold">{DEFAULT_CURRENCY}</span>
                                    </>
                                ) : (
                                    item?.transactions
                                )}
                            </p>
                        </div>
                    </div>
                ))}
            </Card>
        </>
    )
}

export default UserDetails