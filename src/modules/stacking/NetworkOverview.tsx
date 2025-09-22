"use client"
import React from 'react'
import Card from '@/components/Card'

const NetworkOverview = () => {
    return (
        <>
            <Card className='mt-4'>
                <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white'>
                    Network <span className='text-green-500'>Overview</span>
                </p>
                <div className='flex items-center justify-between sm:justify-start gap-2 mt-3 text-gray-300'>
                    <div className='border border-green-500 rounded-lg p-2'>
                        <p>Direct Team</p>
                        <p className='text-sm sm:text-base'>12</p>
                    </div>
                    <div className='border border-green-500 rounded-lg p-2'>
                        <p>Community Size</p>
                        <p className='text-sm sm:text-base'>120</p>
                    </div>
                </div>
            </Card>
        </>
    )
}

export default NetworkOverview
