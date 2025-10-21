import React, { useState } from 'react'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa6';
import { Button } from 'rizzui/button'

const WalletActions = () => {
        const [activeTab, setActiveTab] = useState();
         const handleTabClick = (name?: any ) => {
        setActiveTab(name);
    };
    
  return (
    <>
    <div className='flex items-center justify-center gap-2'>
         {/* <Button className={`w-1/2 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-base transition text-black cursor-pointer border-0 
          ${activeTab === 'invest'
                                ? 'bg-green-500'
                                : 'bg-neutral-800 text-white'
                            }`}
        onClick={() => handleTabClick('invest')}
        >
            Invest <FaArrowDown />

         </Button> */}
         <Button className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-base transition text-black cursor-pointer border-0
          ${activeTab === 'withdraw'
                                ? 'bg-green-500'
                                : 'bg-neutral-800 text-white'
                            }`}
        onClick={() => handleTabClick('withdraw')}
        >
            Withdraw <FaArrowUp />
         </Button>         
    </div>
    </>
  )
}

export default WalletActions