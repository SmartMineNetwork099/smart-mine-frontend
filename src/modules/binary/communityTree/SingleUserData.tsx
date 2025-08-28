import { DEFAULT_CURRENCY } from '@/constants/currency';
import React from 'react'
const walletInfo = [
    {
        name: 'ID',
        transactions: '123',
    },
    {
        name: 'Address',
        transactions: '9jciuefhaoio...ch898',
    },
    {
        name: 'Rank',
        transactions: 'Pioneer',
    },
    {
        name: 'Activation Date',
        transactions: '2024-10-16',
    },
    {
        name: 'Referred By',
        transactions: '4374843',
    },
    {
        name: 'Community Size',
        transactions: '437',
    },

];
const SingleUserData = () => {
    return (
        <>
            <div className='flex flex-col gap-4'>
                {walletInfo?.map((item: { name: string; transactions: string }, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className='w-1/2'>
                            <p className="font-medium p-1  text-sm sm:text-base">
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
            </div>
        </>
    )
}

export default SingleUserData