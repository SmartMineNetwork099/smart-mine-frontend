'use client'
import Image from "next/image";
import React, { useEffect, useState } from "react";
import HashLoader from "@/components/HashLoader";
import { Button } from "rizzui/button";
import Model from "@/components/Model";
import Card from "@/components/Card";
import { getUserIdFromWallet, getUserWalletAddress } from "@/utils/walletHelpers";
import { getAllStackingPlansWithTeamData } from "@/apis/stackingApis";
import SpinnerLoader from "@/components/SpinnerLoader";



const StakingPlansTable = () => {
    const [responsiveColspan, setResponsiveColspan] = useState<number>(2)
        const [modelOpen, setModelOpen] = useState(false);
        const [plans, setPlans] = useState<any[]>([]);
            const [loading, setLoading] = useState(true);
            const [loadingBuy, setLoadingBuy] = useState(false);
        const handleModelOpen = () => {
        setModelOpen(true);
    }
     const handleBuyPlan = async () => {
        setLoadingBuy(true);

     }
    //  const getUserId
     const getStackingPlans = async () => {
        setLoading(true);
        const userId = getUserIdFromWallet()
        const walletAddress = getUserWalletAddress();
     const plans = await getAllStackingPlansWithTeamData(userId , walletAddress);
     console.log(plans?.data, 'plansplansplansplans')
      setPlans(plans?.data || []);
     setLoading(false);
     }
    // Handle Responsive 
    useEffect(() => {
        getStackingPlans();
        const handleResize = () => {
            setResponsiveColspan(window.innerWidth <= 640 ? 2 : 7);
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
                        {/* <th className="px-4 py-2 w-[70px] sm:w-[100px] ">Sno.</th> */}
                        <th className="px-4 py-2 w-[140px] sm:w-[150px] ">Level</th>
                        {/* <th className="px-4 py-2 w-[140px] text-end ">Staking</th> */}
                        <th className="px-4 py-2 w-[140px]">Team</th>
                        <th className="px-4 py-2 w-[140px] text-end ">Income</th>
                        <th className="px-4 py-2 w-[140px] text-end ">Earned</th>
                        <th className="px-4 py-2 w-[140px] text-end ">Loss</th>
                        <th className="px-4 py-2 w-[140px] ">Status</th>
                        <th className="px-4 py-2 w-[140px] ">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                           <td colSpan={responsiveColspan} className="!text-center py-6">
        <div className="flex justify-center items-center">
          <HashLoader />
        </div>
      </td>

                        </tr>
                    ) : plans && plans.length > 0 ? (
                        plans?.map((row: any, rowIndex: number) => (
                            <tr
                                key={rowIndex}
                                className="text-center text-white bg-neutral-800 odd:bg-neutral-900 text-xs sm:text-sm"
                            >
                                <td className="px-4 py-2 whitespace-nowrap ">{row?.level}</td>
                                {/* <td className="px-4 py-2 whitespace-nowrap ">{row?.levelName ?? "-"}</td> */}
                                {/* <td className="px-4 py-2 text-end whitespace-nowrap ">{row?.investment} $</td> */}
                                <td className="px-4 py-2 whitespace-nowrap ">{row?.teamSize}</td>
                                <td className="px-4 py-2 text-end whitespace-nowrap ">{row?.totalEarning} $</td>
                                <td className="px-4 py-2 text-end whitespace-nowrap ">{row?.earned} $</td>
                                <td className="px-4 py-2 text-end whitespace-nowrap text-red-500">{row?.lossAmount} $</td>
<td className="px-4 py-2 whitespace-nowrap ">
  <span
    className={`px-2 py-1 rounded-full text-xs font-semibold ${
      row?.status === 'active'
        ? 'bg-green-500 text-white'
        : 'bg-red-500 text-white'
    }`}
  >
    {row?.status}
  </span>
</td>

<td className="px-4 py-2 whitespace-nowrap ">
    <Button onClick={handleModelOpen} disabled={row?.status=== 'active'} className={` ${
      row?.status === 'active'
        ? 'cursor-not-allowed opacity-40'
        : 'cursor-pointer'
    }  bg-green-500 text-black font-bold border-0`}>Buy {row?.investment}</Button>
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
  {loadingBuy && <SpinnerLoader />}
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
