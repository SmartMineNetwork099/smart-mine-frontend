import Card from '@/components/Card';
import React from 'react'
const RankBonusData = [
    { rank: 'Beginner', amount: 0.09474 },
    { rank: 'Influencer', amount: 0.04845 },
    { rank: 'Achiever', amount: 0.06738 },
    { rank: 'Ambassador', amount: 0.1686 },
    { rank: 'Pioneer', amount: 0 },
    { rank: 'Mentor', amount: 0 },
    { rank: 'Champion', amount: 0 },
    { rank: 'Director', amount: 0 },
    { rank: 'Titan', amount: 0 },
    { rank: 'Icon', amount: 0 },
    { rank: 'Legend', amount: 0 },
    { rank: 'Emperor', amount: 0 },
    { rank: 'Conqueror', amount: 0 },
    { rank: 'Chancellor', amount: 0 },
    { rank: 'Creator', amount: 0 },



];
const RankBonus = () => {
    return (
        <>
        <div className='mt-6 mb-2'>
            <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white'>Rank <span className='text-green-500'>Bonus</span></p>
        </div>
            <div className="p-2 sm:p-4">
                <div className="flex justify-between items-center gap-4 sm:gap-10 mb-4 w-full text-green-500">
                    <h2 className="text-lg font-bold text-center border-2 border-green-500  rounded-lg p-2 w-1/2">Rank</h2>
                    <h2 className="text-lg font-bold text-center border-2 border-green-500 rounded-lg p-2 w-1/2">Amount</h2>
                </div>
                {RankBonusData?.map((data, index) => (
                    <div key={index} className="flex justify-between items-center gap-4 sm:gap-10 mb-2 ">
                        <Card className=" p-2 text-center w-1/2">
                            <p className='font-medium text-white'>
                                {data?.rank}
                            </p>
                        </Card>
                        <Card className=" p-2 text-center text-center w-1/2">
                            <p className='font-medium text-white'>
                                {data?.amount} <span className='text-yellow-400 font-semibold'>ST</span>
                            </p>
                        </Card>
                    </div>
                ))}
            </div>

        </>
    )
}

export default RankBonus