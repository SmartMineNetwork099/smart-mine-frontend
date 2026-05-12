import Image from 'next/image'
import React from 'react'
import CommunityInfo from '@/modules/binary/communityInfo/index';
const page = () => {
    return (
        <>
            <CommunityInfo />
            {/* <div className='h-screen p-4'>
        <Image
          src='/undraw_coming_soon.svg'
          alt='Coming Soon Image'
          width={200}
          height={200}
          className='mx-auto'
        />
        <p className="text-white font-semibold text-lg text-center mt-4">Coming Soon</p>
      </div> */}
        </>
    )
}

export default page