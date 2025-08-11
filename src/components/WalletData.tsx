import React from 'react'
import Card from '@/components/Card';

const walletInfo = [
    {
        name: 'Today Income',
        transactions: '0.001234 ST',
    },
    {
        name: 'Level Income',
        transactions: '0.245 ST',
    },
    {
        name: 'Total Income',
        transactions: '0.03736 ST',
    },
    {
        name: 'Binary Income',
        transactions: '0.6374 ST',
    },
    {
        name: 'Total Withdraw',
        transactions: '0.6374 ST',
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
                            <p className="font-medium text-black bg-white rounded-lg py-1 px-4 text-sm sm:text-base inline sm:block">
                                {item.transactions.includes('ST') ? (
                                    <>
                                        {item?.transactions.replace(' ST', '')}{' '}
                                        <span className="text-yellow-400 font-semibold">ST</span>
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