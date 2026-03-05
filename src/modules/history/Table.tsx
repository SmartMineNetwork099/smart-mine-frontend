"use client";
import React, { useEffect, useState } from "react";
import ViewHistoryTable from '@/components/tables/ViewHistory'
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";
import { IoMdArrowRoundBack } from "react-icons/io";
import { Button } from "rizzui/button";

const Table = () => {
    const [selectTab , setSelectTab] = useState('myIncome')
  const router = useRouter();
  const handleBack = () => router.push(ROUTES?.STACKING?.DASHBOARD);
    const handleTabClick = (name?: any ) => {
         setSelectTab(name)
    };

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

      {/* buttons  */}
      <div className="grid grid-cols-4 gap-1 sm:gap-5 my-4 w-full sm:w-[70%] border text-[10px] sm:text-sm font-semibold sm:font-bold">
         <Button className={`h-[50px] rounded-lg bg-green-500 transition text-white cursor-pointer border-0
         `}
        onClick={() => handleTabClick('myIncome')}
        >
            My Income

         </Button>  
         <Button className={`h-[50px] rounded-lg bg-green-500 transition text-white cursor-pointer border-0
         `}
        onClick={() => handleTabClick('teamIncome')}
        >
            Team Income

         </Button>  
         <Button className={`h-[50px] rounded-lg bg-green-500 transition text-white cursor-pointer border-0
         `}
        onClick={() => handleTabClick('loss')}
        >
            Loss

         </Button>  
         <Button className={`h-[50px] rounded-lg bg-green-500 transition text-white cursor-pointer border-0
         `}
        onClick={() => handleTabClick('withdraw')}
        >
            Withdraw

         </Button>  
      </div>
      <div>
        <ViewHistoryTable/>
      </div>
    </>
  );
};

export default Table;