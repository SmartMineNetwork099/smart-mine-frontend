import React from 'react'
import Card from '@/components/Card';
import { DEFAULT_CURRENCY } from "@/constants/currency";

const walletInfo = [
    {
        name: 'Today Income',
        transactions: '0.001234 USD',
    },
    {
        name: 'Level Income',
        transactions: '0.245 USD',
    },
    {
        name: 'Total Income',
        transactions: '0.03736 USD',
    },
    {
        name: 'Binary Income',
        transactions: '0.6374 USD',
    },
    {
        name: 'Total Withdraw',
        transactions: '0.6374 USD',
    },

];
const WalletData = () => {
    return (
        <>
            <Card className="flex flex-col gap-4 flex-grow">
                {walletInfo?.map((item: { name: string; transactions: string }, index: number) => (
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

export default WalletData