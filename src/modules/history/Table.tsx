"use client";
import React, { useEffect, useState } from "react";
import ViewHistoryTable from '@/components/tables/ViewHistory'
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { IoMdArrowRoundBack } from "react-icons/io";
import Tab from '@/components/Tab';
import { useWalletAddress } from "@/hooks/useWallet";
import { getUserTransactionsApi } from "@/apis/history";
import { normalizeWalletAddress } from "@/utils/func";


const tabs = [
  { label: 'My Income',value:'myIncome'  },
  { label: 'Team Commission', value:'teamIncome' },
  { label: 'M Level', value:'binaryLevelIncome' },
  { label: 'M Upgrade ', value:'binaryUpgradeIncome' },
  { label: 'Withdraw', value:'withdraw' },
];
const Table = () => {
    const [selectTab , setSelectTab] = useState('myIncome')
    const [transactions , setTransactions] = useState<any>([])
    const [loading , setLoading] = useState(true)
    const [totalPaginationPages , setTotalPaginationPages ] = useState(1);
    const [paginationCurrentPage, setPaginationCurrentPage] = useState <any>(1);
  

  const router = useRouter();
  const handleBack = () => router.push(ROUTES?.STACKING?.DASHBOARD);
    const handleTabClick = (name?: string ) => {
         setSelectTab(name||'')
    };
    console.log(selectTab,'selectTabselectTabselectTabselectTab')

     let walletAddress = useWalletAddress();
        walletAddress = normalizeWalletAddress(walletAddress)
    const getUserTransactions = async () =>{
        setLoading(true)
        const {data , error} = await getUserTransactionsApi({type:selectTab , paginationCurrentPage})
        if(data){
            setTransactions(data?.userTransactions|| [])
            setTotalPaginationPages(data?.totalPages)
            setLoading(false)
        }
        if(error){
            console.log(error,'get transaction api error')
        }
    }
    useEffect(()=>{
        getUserTransactions()
    },[walletAddress , selectTab , paginationCurrentPage])

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
        <ViewHistoryTable data={transactions} loading={loading} type={selectTab} totalPaginationPages={totalPaginationPages} paginationCurrentPage={paginationCurrentPage} setPaginationCurrentPage={setPaginationCurrentPage}/>
      </div>
    </>
  );
};

export default Table;