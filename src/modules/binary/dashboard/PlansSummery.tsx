import React from 'react'
import PlansCarousel from '@/components/PlansCarousel';
import Card from '@/components/Card';
import PlansTable from '@/components/tables/PlansTable';
const PlansSummery = () => {
    return (
        <>
            <Card className='mt-8'>
                <div className=''>
                    <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white'>Choose <span className='text-green-500'>Plans</span></p>
                </div>
                <PlansCarousel />
            </Card>



            <Card className='mt-8'>
                <div className=''>
                    <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white mb-4'>View <span className='text-green-500'>Plans</span></p>
                </div>
                <PlansTable />
            </Card>


        </>
    )
}

export default PlansSummery