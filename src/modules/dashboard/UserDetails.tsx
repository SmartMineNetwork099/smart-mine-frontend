'use client'
import React from 'react'
import { Text } from 'rizzui';

const userData = [
    {
        name: 'My Wallet Fund',
        transactions: '0.001234 ST',
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

            <div className="flex flex-col gap-4 p-4 flex-grow bg-gray-600 rounded-lg mt-4">
                {userData?.map((item: { name: string; transactions: string }, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className='w-1/2'>
                            <Text className="font-medium p-1 text-white text-sm sm:text-base">
                                {item?.name}
                            </Text>
                        </div>
                        <div className="w-1/2 sm:w-auto text-left">
                            <Text className="font-medium text-black bg-white rounded-lg py-1 px-4 text-sm sm:text-base inline sm:block">
                                {item.transactions.includes('ST') ? (
                                    <>
                                        {item?.transactions.replace(' ST', '')}{' '}
                                        <span className="text-yellow-400 font-semibold">ST</span>
                                    </>
                                ) : (
                                    item?.transactions
                                )}
                            </Text>
                        </div>
                    </div>
                ))}
            </div>



        </>
    )
}

export default UserDetails