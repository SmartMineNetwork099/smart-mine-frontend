import React from 'react'
import PlansCarousel from '@/components/tables/PlansCarousel';
import Card from '@/components/Card';
const RankBonus = () => {
    return (
        <>
            <Card className='mt-8'>
                <div className=''>
                    <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white'>Choose <span className='text-green-500'>Plans</span></p>
                </div>
                <PlansCarousel />
            </Card>
        </>
    )
}

export default RankBonus