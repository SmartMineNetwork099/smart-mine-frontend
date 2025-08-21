"use client"
import React from 'react'
import Image from 'next/image'
import Card from '@/components/Card'
const index = () => {
  return (
    <>
      <Card className='h-[70vh] flex flex-col gap-2 justify-center items-center'>
        <Image src='/undraw_coming-soon.svg'
          className='w-28 sm:w-40 h-28 sm:h-40'
          alt="Referral image"
          width={160}
          height={160} />
        <p className="text-white font-semibold text-lg">Comming Soon</p>
      </Card>
    </>
  )
}

export default index