import React from 'react'
import Card from '@/components/Card';
import { DEFAULT_CURRENCY } from "@/constants/currency";

const userInfo = [
    {
        name: 'Wallet Address',
        transactions: '4389798ff838439',
    },
    {
        name: 'Wallet Balance',
        transactions: '245 USD',
    },
    {
        name: 'User ID',
        transactions: '4389798ff838439',
    },
    {
        name: 'Rank',
        transactions: 'Beginer',
    },
    {
        name: 'Activation Date',
        transactions: '12-12-2023',
    },
    {
        name: 'Referral By',
        transactions: '49848943jf8484',
    },

];
const UserData = () => {
    return (
        <>
            <Card className="flex flex-col gap-4 flex-grow">
                {userInfo?.map((item: { name: string; transactions: string }, index: number) => (
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

export default UserData