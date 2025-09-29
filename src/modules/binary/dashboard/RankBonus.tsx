import React from 'react'
import { DEFAULT_CURRENCY } from "@/constants/currency";
import PlansTable from '@/components/tables/PlansTable';
const RankBonus = () => {
    return (
        <>
            <div className='mt-6 mb-2'>
                <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white'>Rank <span className='text-green-500'>Bonus</span></p>
            </div>

            <PlansTable />

        </>
    )
}

export default RankBonus