'use client'
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { Button } from "rizzui/button";
import Model from "@/components/Model";
import { Loader } from "rizzui/loader";
import Card from "@/components/Card";


type TableProps = {
    data?: any[];
    loading?: boolean;
};
 const plans = [
  { levelName: "Starter", level: 1, investment: 5, totalEarning: 10, earned: 2.5, lossAmount: 0.5, status: "Active" },
  { levelName: "Basic", level: 2, investment: 10, totalEarning: 20, earned: 5, lossAmount: 1, status: "Not Active" },
  { levelName: "Silver", level: 3, investment: 15, totalEarning: 30, earned: 10, lossAmount: 1.5, status: "Active" },
  { levelName: "Gold", level: 4, investment: 20, totalEarning: 40, earned: 12, lossAmount: 2, status: "Not Active" },
  { levelName: "Platinum", level: 5, investment: 25, totalEarning: 50, earned: 20, lossAmount: 2.5, status: "Active" },
  { levelName: "Diamond", level: 6, investment: 30, totalEarning: 60, earned: 18, lossAmount: 3, status: "Not Active" },
  { levelName: "Elite", level: 7, investment: 35, totalEarning: 70, earned: 25, lossAmount: 3.5, status: "Active" },
  { levelName: "Pro", level: 8, investment: 40, totalEarning: 80, earned: 30, lossAmount: 4, status: "Not Active" },
  { levelName: "Premium", level: 9, investment: 45, totalEarning: 90, earned: 35, lossAmount: 4.5, status: "Active" },
  { levelName: "Master", level: 10, investment: 50, totalEarning: 100, earned: 40, lossAmount: 5, status: "Not Active" },
  { levelName: "Legend", level: 11, investment: 55, totalEarning: 110, earned: 50, lossAmount: 5.5, status: "Active" },
  { levelName: "Royal", level: 12, investment: 60, totalEarning: 120, earned: 45, lossAmount: 6, status: "Not Active" },
  { levelName: "Supreme", level: 13, investment: 65, totalEarning: 130, earned: 60, lossAmount: 6.5, status: "Active" },
  { levelName: "Ultimate", level: 14, investment: 70, totalEarning: 140, earned: 50, lossAmount: 7, status: "Not Active" },
  { levelName: "Infinity", level: 15, investment: 75, totalEarning: 150, earned: 75, lossAmount: 7.5, status: "Active" },
];



const StakingPlansTable = ({ data, loading = false }: TableProps) => {
    const [responsiveColspan, setResponsiveColspan] = useState<number>(2)
        const [modelOpen, setModelOpen] = useState(false);
            const [loadingBuy, setLoadingBuy] = useState(false);
        const handleModelOpen = () => {
        setModelOpen(true);
    }
     const handleBuyPlan = async () => {

     }
    // Handle Responsive 
    useEffect(() => {
        const handleResize = () => {
            setResponsiveColspan(window.innerWidth <= 640 ? 2 : 6);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return (
        <>
        <Card>
             <p className="font-semibold sm:font-bold text-xl sm:text-3xl text-white">
                Plans <span className="text-green-500">Summery</span>
            </p>
        <div className="overflow-x-auto w-full rounded-lg scrollbar-hidden mt-4">
            <table className="min-w-[500px] w-full text-sm border-collapse">
                <thead className="sticky top-0 z-10 bg-green-500 text-black">
                    <tr className="bg-green-500 text-black font-bold text-center">
                        <th className="px-4 py-2 w-[70px] sm:w-[100px] ">Sno.</th>
                        <th className="px-4 py-2 w-[140px] sm:w-[150px] ">Level</th>
                        <th className="px-4 py-2 w-[140px] text-end ">Staking</th>
                        <th className="px-4 py-2 w-[140px] text-end ">Income</th>
                        <th className="px-4 py-2 w-[140px] text-end ">Earned</th>
                        <th className="px-4 py-2 w-[140px] text-end ">Loss</th>
                        <th className="px-4 py-2 w-[140px] ">Status</th>
                        <th className="px-4 py-2 w-[140px]">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={responsiveColspan} className="!text-center py-6">
                                <div className="flex justify-center items-center">
                                    <Loading />
                                </div>
                            </td>
                        </tr>
                    ) : plans && plans.length > 0 ? (
                        plans?.map((row: any, rowIndex: number) => (
                            <tr
                                key={rowIndex}
                                className="text-center text-white bg-neutral-800 odd:bg-neutral-900 text-xs sm:text-sm"
                            >
                                <td className="px-4 py-2 whitespace-nowrap ">{rowIndex + 1}</td>
                                <td className="px-4 py-2 whitespace-nowrap ">{row?.levelName ?? "-"}</td>
                                <td className="px-4 py-2 text-end whitespace-nowrap ">{row?.investment} $</td>
                                <td className="px-4 py-2 text-end whitespace-nowrap ">{row?.totalEarning} $</td>
                                <td className="px-4 py-2 text-end whitespace-nowrap ">{row?.earned} $</td>
                                <td className="px-4 py-2 text-end whitespace-nowrap ">{row?.lossAmount} $</td>
<td className="px-4 py-2 whitespace-nowrap ">
  <span
    className={`px-2 py-1 rounded-full text-xs font-semibold ${
      row?.status === 'Active'
        ? 'bg-green-500 text-white'
        : 'bg-red-500 text-white'
    }`}
  >
    {row?.status}
  </span>
</td>
<td className="px-4 py-2 whitespace-nowrap ">
    <Button onClick={handleModelOpen} className={` ${
      row?.status === 'Active'
        ? 'cursor-not-allowed opacity-40'
        : 'cursor-pointer'
    }  bg-green-500 text-black font-bold border-0`}>Buy</Button>
</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={responsiveColspan} className="text-center py-6">
                                <Image
                                    src="/undraw_no_data_found.svg"
                                    className="mx-auto w-28 sm:w-40 h-28 sm:h-40"
                                    alt="No data found image"
                                    width={160}
                                    height={160}
                                />
                                <p className="text-white mt-2 font-bold">No Data Found</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
               {modelOpen && (
                        <Model isOpen={modelOpen} onClose={() => setModelOpen(false)} title={`Confirm Purchase`} className="!bg-gray-200">
                            <div>
                                <p className="text-white text-center">Are you sure want to purshase </p>
                                <div className="flex justify-center gap-4 mt-6">
                                  <button
  onClick={handleBuyPlan}
  disabled={loadingBuy}
  className={`flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-lg font-bold ${
    loadingBuy ? 'opacity-70 cursor-not-allowed' : ''
  }`}
>
  Buy
  {loadingBuy && <Loader size="sm" className="text-white" />}
</button>
                                    <button
                                      disabled={loadingBuy}
                                        onClick={() => setModelOpen(false)}
                                        className={`bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl text-lg font-bold ${
    loadingBuy ? 'opacity-70 cursor-not-allowed' : ''
  }`}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </Model>
                    )}
        </div>
        </Card>
        </>
    );
};

export default StakingPlansTable;
