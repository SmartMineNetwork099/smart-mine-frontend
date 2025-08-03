import React from 'react'
import { Text } from 'rizzui';

const TodayBonus = () => {
    return (
        <>
            <div className='flex items-center justify-between rounded-lg bg-gray-600 px-3 py-2 text-sm sm:text-base'>
                <Text className='font-medium p-1 text-white'>Today&apos;s Bonus</Text>
                <Text className='font-semibold p-1 text-yellow-400'>0.00123 ST</Text>
            </div>
        </>
    )
}

export default TodayBonus