"use client";
import React, { useEffect, useState } from "react";
import ViewHistoryTable from '@/components/tables/ViewHistory'
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { IoMdArrowRoundBack } from "react-icons/io";
import Tab from '@/components/Tab';
import { useWalletAddress } from "@/hooks/useWallet";
import { getUserTransactionsApi } from "@/apis/history";


const tabs = [
  { label: 'My Income',value:'myIncome'  },
  { label: ' Team Income', value:'teamIncome' },
  { label: 'Loss', value:'loss' },
  { label: 'Withdraw', value:'withdraw' },
];
const Table = () => {
    const [selectTab , setSelectTab] = useState('myIncome')
    const [transactions , setTransactions] = useState([])
    const [loading , setLoading] = useState(true)
  const router = useRouter();
  const handleBack = () => router.push(ROUTES?.STACKING?.DASHBOARD);
    const handleTabClick = (name?: string ) => {
         setSelectTab(name||'')
    };
    console.log(selectTab,'selectTabselectTabselectTabselectTab')

    const walletAddress = useWalletAddress();
    const getUserTransactions = async () =>{
        setLoading(true)
        const {data , error} = await getUserTransactionsApi({type:selectTab})
        if(data){
            setTransactions(data|| [])
            setLoading(false)
        }
        if(error){
            console.log(error,'get transaction api error')
        }
        console.log(data,'ddaattaattaa')
    }
    useEffect(()=>{
         if (!walletAddress) return;
        getUserTransactions()
    },[walletAddress , selectTab])

  return (
    <>
      {/* header */}
      <div className="flex gap-2 items-center mb-4">
        <IoMdArrowRoundBack className="cursor-pointer text-4xl text-white" onClick={handleBack} />
        <p className="font-semibold sm:font-bold text-xl sm:text-3xl text-white">
          <span className="">View </span>
          <span className="text-green-500"> History</span>
        </p>
      </div>

     <Tab tabs={tabs} onTabChange={handleTabClick} defaultTab="myIncome"/>
      <div className="mt-3">
        <ViewHistoryTable data={transactions} loading={loading} type={selectTab}/>
      </div>
    </>
  );
};

export default Table;