"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Card from '@/components/Card'
import { getWalletIncomeStatsApi } from '@/apis/withdrawApis'
import { formatAmount } from '@/utils/func'
import { toast } from 'react-toastify'
import Actions from './Actions'
const AdminCards = () => {
    const [loading , setLoading] = useState<boolean>(false);
    const [usersData , setUsersData] = useState<any>({});

  const walletData = async () => {
    setLoading(true);
    const {data , error} = await getWalletIncomeStatsApi();
    if(error){
        toast.error(error);
        setLoading(false);
        return;
    }
    console.log(data, 'walletDatawalletDatawalletData')
    if(data?.success){
    setUsersData(data?.data)
    }
    setLoading(false);
  }
  useEffect(() => {
    walletData();
  }, [])

    const walletInfo = [
      { name: "Total My Income", transactions: `$${formatAmount(usersData?.totalMyIncome || 0)}` },
      { name: "Total Team Income", transactions: `$${formatAmount(usersData?.totalTeamIncome || 0)}`   },
      { name: "Total Binary Income", transactions: `$${formatAmount(usersData?.totalBinaryIncome || 0)}`   },
      { name: "Total Auto Activation", transactions: `$${formatAmount(usersData?.totalAutoActivation || 0)}`   },
    ];
  return (
    <>
      <Card className=''>
        {
            loading &&
              <p className='font-bold text-center text-green-500'>Loading...</p>
        }
      <div className=" py-2 px-0.5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-4">
             {walletInfo?.map((item, index) => (
               <div
                 key={index}
                 className={`flex  justify-between py-3 sm:py-4 px-3 sm:px-2 backdrop-blur-sm ${
                   item?.name.includes("Loss") ? "bg-red-500" : " "
                 } text-white rounded-lg`}
               >
                 <div className="">
     
                 <div>
                   <p className={`font-bold ${item?.name.includes("Loss") ? "text-black" : "text-gray-300"} text-xs sm:text-base`}>
                     {item?.name}
                   </p>
                 </div>
                 <div className="sm:w-auto">
                   <p
                     className={`font-bold ${
                       item?.name.includes("Loss") ? "text-black" : "text-green-500"
                     } rounded-lg text-sm sm:text-base inline sm:block`}
                   >
                     {item?.transactions}
                   </p>
                 </div>
                 </div>
               </div>
             ))}
           </div>


      </Card>
<div className='mt-4'>
<Actions/>
</div>
    </>
  )
}

export default AdminCards