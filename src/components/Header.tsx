import React from 'react'
import { Button } from 'rizzui'

const Header = () => {
  return (
    <>
    <div className='flex items-center justify-between bg-black p-2'>
        <p className='cursor-pointer font-bold border-2 border-yellow-300 text-yellow-300 py-2 px-3 rounded-full text-center'>ST</p>
        <Button className='bg-red-500 px-3 py-2 cursor-pointer text-white font-semibold rounded-md border-0'>Logout</Button>
    </div>
    </>
  )
}

export default Header