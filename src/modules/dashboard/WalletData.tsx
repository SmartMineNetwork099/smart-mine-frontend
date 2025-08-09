import React from 'react'
import { Text } from 'rizzui';

const walletData = [
    {
        name: 'Available Balance',
        transactions: '0.001234 ST',
    },
    {
        name: 'Today Income',
        transactions: '0.245 ST',
    },
    {
        name: 'Total Income',
        transactions: '0.03736 ST',
    },
    {
        name: 'Total Withdraw',
        transactions: '0.6374 ST',
    },
  
];
const WalletData = () => {
    return (
        <>
            <div className="flex flex-col gap-4 p-4 flex-grow bg-gray-600 rounded-lg mt-4">
                {walletData?.map((item: { name: string; transactions: string }, index: number) => (
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

export default WalletData