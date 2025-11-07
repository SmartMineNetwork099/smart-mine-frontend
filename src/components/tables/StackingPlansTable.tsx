'use client'
import Image from "next/image";
import React, { useEffect, useState } from "react";
import HashLoader from "@/components/HashLoader";
import { Button } from "rizzui/button";
import Model from "@/components/Model";
import Card from "@/components/Card";
import { getUserIdFromWallet, getUserWalletAddress } from "@/utils/walletHelpers";
import { buyStackingPlans, getAllStackingPlansWithTeamData } from "@/apis/stackingApis";
import SpinnerLoader from "@/components/SpinnerLoader";
import { formatAmount } from "@/utils/func";
import { sendPlatformFee } from "@/utils/paymentHandler";
import { toast } from "react-toastify";

const StakingPlansTable = () => {
  const [responsiveColspan, setResponsiveColspan] = useState<number>(2);
  const [modelOpen, setModelOpen] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>({}); // ✅ for dynamic level

  const userId = getUserIdFromWallet();
  const walletAddress = getUserWalletAddress();

  // ✅ Open model and store selected plan level
  const handleModelOpen = (level: number) => {
    console.log(level,'lleevveell')
    setSelectedPlan(level);
    setModelOpen(true);
  };

  // ✅ Handle buy plan dynamically
  const handleBuyPlan = async () => {
    if (!selectedPlan) return;
    try {
      setLoadingBuy(true);
      // const amount = selectedPlan?.investment;
      /////////////////////////////////////
    // const feeResult = await sendPlatformFee(false ,true , amount);
    // if (!feeResult.success) {
    //   toast.error(feeResult.message || "Payment failed.");
    //   return false;
    // }
    // const { feeTxHash, userWalletAddress } = feeResult;
      /////////////////////////////////////
      const buyPlanApi = await buyStackingPlans({
        userId,
        planId: selectedPlan?._id, // ✅ Dynamic level
        // feeTxHash,
        paymentTxHash: '0x1234567890abcdef',
        // walletAddress:userWalletAddress
      });
      if(buyPlanApi.data.success)
        {
          toast.success(buyPlanApi.data.message);
        }else{
          toast.error(buyPlanApi.error);
        }
      console.log(buyPlanApi, 'buyPlanApi');
      // ✅ Reset states after success
      setModelOpen(false);
      setSelectedPlan(null);
      await getStackingPlans(false); // Refresh plans
      setLoadingBuy(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingBuy(false);
    }
  };

  const getStackingPlans = async (loader = true) => {
    if(loader){
        setLoading(true);
    } 
    const plans = await getAllStackingPlansWithTeamData(userId, walletAddress);
    console.log(plans?.data, 'plans data');
    setPlans(plans?.data || []);
    setLoading(false);
  };

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
          <table className="min-w-[380px] w-full text-sm border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-green-500 text-black font-bold text-xs sm:text-base text-center">
                <th className="px-1 sm:px-4 py-2 w-[40px] sm:w-[150px] ">Level</th>
                <th className="px-2 sm:px-4 py-2 w-[100px] sm:w-[140px]">Team</th>
                <th className="px-2 sm:px-4 py-2 w-[90px] sm:w-[150px] text-end ">Earn 2x</th>
                <th className="px-2 sm:px-4 py-2 w-[80px] sm:w-[140px] text-end ">Loss</th>
                <th className="px-2 sm:px-4 py-2 w-[60px] sm:w-[140px] ">Status</th>
                <th className="px-2 sm:px-4 py-2 w-[70px] sm:w-[140px] ">Action</th>
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
                plans.map((row: any, rowIndex: number) => (
                  <tr
                    key={rowIndex}
                    className="text-center text-white bg-neutral-800 odd:bg-neutral-900 text-xs sm:text-sm"
                  >
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap ">{row?.level}</td>
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap ">{row?.teamSize}</td>
                    <td className="px-2 sm:px-4 py-2 text-end whitespace-nowrap ">{formatAmount(row?.earned)} $ </td>
                    <td className="px-2 sm:px-4 py-2 text-end whitespace-nowrap text-red-500 "> {formatAmount(row?.lossAmount)} $</td>
                    <td className="">
                      <span
                        className={`px-1 py-1 text-white rounded-full text-[10px] sm:text-xs font-semibold ${
                          row?.status === 'active'
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      >
                        {row?.status}
                      </span>
                    </td>

                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap ">
                      <Button
                        onClick={() => handleModelOpen(row)}
                        disabled={row?.status === 'active' || loadingBuy}
                        className={`px-2 py-1 text-[10px] sm:text-sm rounded-md ${
                          row?.status === 'active' || loadingBuy
                            ? 'cursor-not-allowed opacity-40'
                            : 'cursor-pointer'
                        } bg-green-500 text-black font-bold border-0`}
                      >
                        Buy {row?.investment} $
                      </Button>
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

          {/* ✅ Modal */}
          {modelOpen && (
            <Model
              isOpen={modelOpen}
              onClose={() => setModelOpen(false)}
              title={`Confirm Purchase`}
              className="!bg-gray-200"
            >
              <div>
                <p className="text-white text-center">
                  Are you sure you want to purchase{" "}
                  <span className="text-green-400 font-semibold">Level {selectedPlan?.level}</span>?
                </p>
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
                    onClick={() => {
                      setModelOpen(false);
                      setSelectedPlan(null);
                    }}
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
