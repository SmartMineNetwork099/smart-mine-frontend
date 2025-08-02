import React from 'react'
import { Text,Button } from 'rizzui'

const Header = () => {
  return (
    <>
    <div className='flex items-center justify-between bg-black p-2'>
        <Text className='cursor-pointer font-bold border border-yellow-300 bg-yellow-300 py-2 px-3 rounded-full text-center'>ST</Text>
        <Button className='bg-red-500 px-3 py-2 cursor-pointer text-white font-semibold rounded-md border-0'>Logout</Button>
    </div>
    </>
  )
}

export default Header