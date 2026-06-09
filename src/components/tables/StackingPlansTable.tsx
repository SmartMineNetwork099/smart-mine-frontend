'use client'
import Image from "next/image";
import React, { useEffect, useState } from "react";
import HashLoader from "@/components/HashLoader";
import { Button } from "rizzui/button";
import Model from "@/components/Model";
import Card from "@/components/Card";
import { buyStackingPlans, getUserStackingPlans } from "@/apis/stackingApis";
import SpinnerLoader from "@/components/SpinnerLoader";
import { formatAmount, normalizeTxHash } from "@/utils/func";
import { sendPlatformFee } from "@/utils/paymentHandler";
import { toast } from "react-toastify";
import { getUserData } from "@/db/getData";
import { roundTo4 } from "@/utils/amount";
import { upsertUserData } from "@/db/saveData";
import { useUserData } from "@/hooks/useUserData";
import Messages from "@/constants/messages";
import { getUserDataApi } from "@/apis/user";

const StakingPlansTable = () => {
  const [responsiveColspan, setResponsiveColspan] = useState<number>(2);
  const [modelOpen, setModelOpen] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBuy, setLoadingBuy] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>({}); // ✅ for dynamic level
  const [userData, setUserData] = useState<any>({});
  const { isFreeze,walletAddress} = useUserData();


  // ✅ Open model and store selected plan level
  const handleModelOpen = (level: number) => {
    console.log(level,'lleevveell')
    setSelectedPlan(level);
    setModelOpen(true);
  };

  // ✅ Handle buy plan dynamically
  const handleBuyPlan = async () => {
    if (!selectedPlan) return;
    if (!walletAddress) return;
    if(isFreeze){
      toast.error(Messages?.FREEZE_ACCOUNT)
      return;
    }

    try {
      setLoadingBuy(true);
       // 1) Local user data
            const localUser:any = await getUserData(walletAddress);
            console.log(localUser,'localUserlocalUser11')
            if(localUser.freeze===true){
               toast.error(Messages?.FREEZE_ACCOUNT)
               setLoadingBuy(false);
               setModelOpen(false);
               return;
            }

            const planAmount = roundTo4(selectedPlan?.investment || 0);
            const shareIncome = roundTo4(localUser?.wallet?.shareIncome || 0);

             let feeTxHash: string | null = null;
             let paymentSource = "";

              // 2) Check local wallet first
    if (shareIncome >= planAmount) {
      paymentSource = "share_income";
    } else {
      // 3) Fallback to SafePal wallet payment
      const type = "buy_stacking_plan";

      const { success, message, feeTxHash: blockchainTxHash } =
        await sendPlatformFee({
          type,
          planBuyAmount: String(planAmount),
        });
        if (success === false) {
        toast.error(message || "Payment failed.");
        return;
      }

       feeTxHash = blockchainTxHash ?? null;
       feeTxHash= normalizeTxHash(feeTxHash)
      paymentSource = "safepal";
      }


      // 4) Call backend API
      const buyPlanApi = await buyStackingPlans({
        planId: selectedPlan?.templatePlanId, // ✅ Dynamic level
        feeTxHash,
        paymentSource, // "share_income" or "safepal"
      });
      if(buyPlanApi.data.success)
        {
          toast.success(buyPlanApi.data.message);
          // update user wallet locally
          const updatedFields = {
            wallet : buyPlanApi?.data?.userWallet, 
          }
          await upsertUserData(walletAddress, updatedFields);
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
      setModelOpen(false);
    }
  };

  const getStackingPlans = async (loader = true) => {
    if(loader){
        setLoading(true);
    } 
    const plans = await getUserStackingPlans();
    console.log(plans?.data, 'stacking_plans_data');
    setPlans(plans?.data?.userPlans || []);
    setLoading(false);
  };

  // Handle Responsive 
  useEffect(() => {
    if(walletAddress){
      getStackingPlans();
    }
    const handleResize = () => {
      setResponsiveColspan(window.innerWidth <= 640 ? 2 : 7);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [walletAddress]);

  const getUserDataFun = async () => {
        const res = await getUserDataApi();
        const user = res?.data?.user || {};
        setUserData(user);
  }

  useEffect(() => {
   getUserDataFun()
  }, []);

  return (
    <>
      <Card>
        <p className="font-semibold sm:font-bold text-xl sm:text-3xl text-white">
          Plans <span className="text-green-500">Summery</span>
        </p>
        <p className="font-semibold text-white text-sm sm:text-base text-end">
          Auto Upgrade Plans
          <span className="text-green-500 pl-1 border-2 border-green-500 p-1 rounded-md ml-1">{roundTo4(userData?.wallet?.autoActivationIncome || 0)}</span>
        </p>
        <div className="overflow-x-auto w-full rounded-lg scrollbar-hidden mt-4">
          <table className="min-w-[360px] w-full text-sm border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-green-500 text-black font-bold text-xs sm:text-base text-center">
                <th className="px-2 sm:px-4 py-2 w-[25%]">Action</th>
                <th className="px-2 sm:px-4 py-2 w-[25%] text-end">Earn 3x</th>
                <th className="px-2 sm:px-4 py-2 w-[25%] text-end">Loss</th>
                <th className="px-2 sm:px-4 py-2 w-[50px] sm:w-[25%]">Status</th>
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
              ) : plans && plans?.length > 0 ? (
                plans?.map((row: any, rowIndex: number) => (
                  <tr
                    key={rowIndex}
                    className="text-center text-white bg-neutral-700/5 odd:bg-neutral-700/70 text-xs sm:text-sm"
                  >
                      <td className="px-2 sm:px-4 py-2 whitespace-nowrap ">
                      <Button
                        onClick={() => handleModelOpen(row)}
                        disabled={row?.status === 'active' && row?.isPurchased === true || loadingBuy}
                        className={`w-[90px] sm:w-[100px] px-1 rounded-md ${
                          row?.status === 'active' && row?.isPurchased === true || loadingBuy
                            ? 'cursor-not-allowed opacity-40'
                            : 'cursor-pointer'
                        } bg-green-500 text-black font-bold sm:font-extrabold border-0`}
                      >
                        Buy ${row?.investment}
                      </Button>
                    </td>
                    <td className="px-2 sm:px-4 py-2 text-end whitespace-nowrap ">${formatAmount(row?.earned)} </td>
                    <td className="px-2 sm:px-4 py-2 text-end whitespace-nowrap text-red-500 "> ${formatAmount(row?.lossAmount)}</td>
                    <td className="">
                      <Button
                        className={`w-[65px] sm:w-[100px] border-0 px-1 py-2 text-black rounded-md font-bold sm:font-extrabold ${
                          row?.status === 'active' && row?.isPurchased === true
                            ? 'bg-green-500'
                            : 'bg-red-500'
                        }`}
                      >
                        {row?.status}
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
