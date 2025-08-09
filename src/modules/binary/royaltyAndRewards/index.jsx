"use client"
import React from 'react'
import Image from 'next/image'
import { Text } from 'rizzui'
const index = () => {
  return (
    <>
      <div className='h-screen bg-gray-600 rounded-lg flex flex-col gap-2 justify-center items-center'>
        <Image src='/undraw_coming-soon.svg'
          className='w-28 sm:w-40 h-28 sm:h-40'
          alt="Referral image"
          width={160}
          height={160} />
        <Text className="text-white font-semibold text-lg">Comming Soon</Text>
      </div>
    </>
  )
}

export default index