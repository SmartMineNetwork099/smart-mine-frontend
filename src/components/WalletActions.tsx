"use client"
import React, {  useState } from 'react'
import { Button } from 'rizzui/button'
import { useRouter } from 'next/navigation';
import Model from "@/components/Model";
import ROUTES from '@/constants/routes';
import { MdOutlineWorkHistory } from 'react-icons/md';
import { BiMoneyWithdraw } from 'react-icons/bi';
import SpinnerLoader from './SpinnerLoader';
import { verifyFreezeFeePaymentApi } from '@/apis/withdrawApis';
import { Loader } from 'rizzui/loader';
import { toast } from 'react-toastify';
import Messages from '@/constants/messages';
import { useUserData } from '@/hooks/useUserData';
import { sendPlatformFee } from '@/utils/paymentHandler';
import { upsertUserData } from '@/db/saveData';
import { FREEZE_FEE_BNB } from '@/config/constants';
import { roundTo4 } from '@/utils/amount';

const WalletActions = () => {
      const router = useRouter();
      const [showModel , setShowModel]= useState(false)
      const [loading , setLoading]= useState(false)
      const { isFreeze,walletAddress, refreshUser } = useUserData();
      
      
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
        if(!isFreeze) return
        setShowModel(true)
      }
      const PayRegistrationFee =async() =>{
          if(!isFreeze){
            toast.success("Your account is not freeze")
            return
          }
          if(!FREEZE_FEE_BNB){
            toast.error('please wait while fetching fee')
          }
        setLoading(true)
        const freezeAccountFee = roundTo4(FREEZE_FEE_BNB);
        const {success, feeTxHash , message} = await sendPlatformFee({type: "freeze_fee", freezeFeeBnb:String(freezeAccountFee)});
        if(success===false){
          toast.error(message)
          setLoading(false)
          setShowModel(false)
          return
        }
        if(success){
          toast.success(message)
          const payload = {
        feeTxHash
        }
        const {data , error } = await verifyFreezeFeePaymentApi(payload)
        if(error){
          toast.error(error || 'verify Freeze FeePayment error')
        }
        if(data){
          toast.success(data?.message)
             const updatedFields = {
                     freeze : data?.freeze,
                    }
                    await upsertUserData(walletAddress || '', updatedFields);
                    await refreshUser();
                     window.dispatchEvent(
                  new CustomEvent("wallet-updated", {
                   detail: { walletAddress },
                  })
                  );
        }
         setLoading(false)
         setShowModel(false)
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
    {
      isFreeze && 
    <div className='mt-2'>
        <Button className={`w-full flex items-center justify-center gap-2 py-4 h-[50px] rounded-lg bg-green-500 font-bold text-sm sm:text-xl transition text-white cursor-pointer border-0`}
        onClick={handlePayRegistrationFee}
        >
            Pay Registration Fee <BiMoneyWithdraw className='text-xl'/>
         </Button>
    </div>
    }

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
                    FREEZE_FEE_BNB ? 
                    <span className="text-green-400 font-semibold"> { FREEZE_FEE_BNB  } BNB</span>
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
                    Pay
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