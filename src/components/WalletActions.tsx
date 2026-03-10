"use client"
import React, { useEffect, useState } from 'react'
import { Button } from 'rizzui/button'
import { useRouter } from 'next/navigation';
import Model from "@/components/Model";
import ROUTES from '@/constants/routes';
import { MdOutlineWorkHistory } from 'react-icons/md';
import { BiMoneyWithdraw } from 'react-icons/bi';
import SpinnerLoader from './SpinnerLoader';
import { confirmFreezeFeePaymentApi, getFreezeFeeQuote } from '@/apis/withdrawApis';
import { Loader } from 'rizzui/loader';
import { getUserData } from '@/db/getData';
import { useWalletAddress } from '@/hooks/useWallet';
import { toast } from 'react-toastify';
import Messages from '@/constants/messages';
import { useUserData } from '@/hooks/useUserData';
import { sendPlatformFee } from '@/utils/paymentHandler';


const WalletActions = () => {
      const router = useRouter();
      const [showModel , setShowModel]= useState(false)
      const [loading , setLoading]= useState(false)
      const [data , setData] = useState<any>(null)
      const { isFreeze } = useUserData();
      
      const handleTabClick = async (name?: any ) => {
        toast.dismiss()
        if (isFreeze) {
          toast.error(Messages?.FREEZE_ACCOUNT);
          return;
          }
          if(name==='withdraw'){
            router.push(ROUTES?.WITHDRAW?.HOME)
          }
          if(name==='history'){
            router.push(ROUTES?.HISTORY?.HOME)
          }
      };

      const handlePayRegistrationFee =async() =>{
        setShowModel(true)
        setLoading(true)
        const {data , error} = await getFreezeFeeQuote();
        console.log(data,'data in getFreezeFeeQuote')
        setData(data)
        setLoading(false)

      }
      const PayRegistrationFee =async() =>{
        setLoading(true)
        const {success, feeTxHash, userWalletAddress, message} = await sendPlatformFee({type: "freeze_fee", freezeFeeBnb:data?.requiredBnb});
       if(success){
        const payload = {

        }
        const {data , error } = await confirmFreezeFeePaymentApi(payload)
         setLoading(false)
       }

      }
    
  return (
    <>
    <div className='flex items-center justify-center gap-2'>
         <Button className={`w-full flex items-center justify-center gap-2 py-4 h-[50px] rounded-lg bg-green-500 font-bold text-sm sm:text-xl transition text-white cursor-pointer border-0`}
        onClick={() => handleTabClick('withdraw')}
        >
            Withdraw <BiMoneyWithdraw className='text-xl'/>
         </Button>


         <Button className={`w-full flex items-center justify-center gap-2 py-4 h-[50px] rounded-lg bg-green-500 font-bold text-sm sm:text-xl transition text-white cursor-pointer border-0`}
        onClick={() => handleTabClick('history')}
        >
            View History   <MdOutlineWorkHistory className='text-xl'/>

         </Button>         
    </div>
    <div className='mt-2'>
        <Button className={`w-full flex items-center justify-center gap-2 py-4 h-[50px] rounded-lg bg-green-500 font-bold text-sm sm:text-xl transition text-white cursor-pointer border-0`}
        onClick={handlePayRegistrationFee}
        >
            Pay Registration Fee <BiMoneyWithdraw className='text-xl'/>
         </Button>
    </div>

     {/* ✅ Modal */}
          {showModel && (
            <Model
              isOpen={showModel}
              onClose={() => setShowModel(false)}
              title={`Confirm Purchase`}
              className="!bg-gray-200"
            >
              <div>
                <p className="text-white text-center">
                  Are you sure you want to pay Registration Fee{" "}
                  <p className='flex items-center justify-center'>
                  {
                    data ? 
                    <span className="text-green-400 font-semibold"> { data?.requiredBnb  } BNB</span>
                    :
                     <Loader variant="threeDot" size='sm' color="success" className='text-green-500'/>
                    }
                    </p>
                </p>
                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={PayRegistrationFee}
                    disabled={loading}
                    className={`flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-lg font-bold ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    Buy
                    {loading && <SpinnerLoader />}
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => {
                      setShowModel(false);
                    }}
                    className={`bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl text-lg font-bold ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Model>
          )}
    </>
  )
}

export default WalletActions