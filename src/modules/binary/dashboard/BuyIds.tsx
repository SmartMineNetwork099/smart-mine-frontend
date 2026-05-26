"use client";
import React, { useState } from "react";
import Card from '@/components/Card';
import { useUserData } from "@/hooks/useUserData";
import { toast } from "react-toastify";
import Messages from "@/constants/messages";
import { getUserData } from "@/db/getData";
import { roundTo4 } from "@/utils/amount";
import { sendPlatformFee } from "@/utils/paymentHandler";
import { normalizeTxHash } from "@/utils/func";
import { buyIds } from "@/apis/binaryApis";
import { upsertUserData } from "@/db/saveData";
import { getUserStackingPlans } from "@/apis/stackingApis";
import SpinnerLoader from "@/components/SpinnerLoader";

const BuyIds: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isFreeze,walletAddress} = useUserData();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === '') return setCount(0);
    const n = Number(v);
    if (Number.isNaN(n)) return;
    setCount(n);
  };

  const handleBuy = () => {
    if(count === 0 || count < 1) {
      return;
    }
    setShowConfirm(true);
  };

  const confirmBuy = async () => {
    setLoading(true);
     if (!walletAddress) return;
    if(isFreeze){
      toast.error(Messages?.FREEZE_ACCOUNT)
      setLoading(false);
      return;
    }
      const plans = await getUserStackingPlans();
      console.log(plans?.data, 'stacking_plans_data');
      const hasPurchasedAboveLevel1 = plans?.data?.some(
       (plan:any) =>
        plan?.level > 1 &&
        plan?.isPurchased === true &&
        plan?.status === "active"
        );

        if(!hasPurchasedAboveLevel1){
          toast.error("You need an active plan above Level 1 to buy IDs.");
          setLoading(false);
          setShowConfirm(false);
          return;
        }



    try {

        // 1) Local user data
            const localUser:any = await getUserData(walletAddress);
            console.log(localUser,'localUserlocalUser11')
            if(localUser.freeze===true){
               toast.error(Messages?.FREEZE_ACCOUNT)
               setLoading(false);
               setShowConfirm(false);
               return;
            }

            const idAmount = roundTo4(count * 3 || 0);
            const shareIncome = roundTo4(localUser?.wallet?.shareIncome || 0);



            ////////////////////////////////////////////////////////////
             let feeTxHash: string | null = null;
             let paymentSource = "";
               // 2) Check local wallet first
                 if (shareIncome >= idAmount) {
                   paymentSource = "share_income";
                 } else {
                   // 3) Fallback to SafePal wallet payment
                   const type = "buy_ids";
             
                   const { success, message, feeTxHash: blockchainTxHash } =
                     await sendPlatformFee({
                       type,
                       planBuyAmount: String(idAmount),
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
                         const buyIdsApi = await buyIds({
                           numberOfIds: count, // ✅ Dynamic level
                           feeTxHash,
                           paymentSource, // "share_income" or "safepal"
                         });

                          if(buyIdsApi.data.success)
                                 {
                                   toast.success(buyIdsApi.data.message);
                                   // update user wallet locally
                                   const updatedFields = {
                                     wallet : buyIdsApi?.data?.userWallet, 
                                   }
                                   await upsertUserData(walletAddress, updatedFields);
                                 }else{
                                   toast.error(buyIdsApi.error);
                                 }
        
                                 setShowConfirm(false);
                                 setCount(0);
                                 setLoading(false);
    } catch (error) {
        console.log(error,'buyIdsErrorbuyIdsErrorbuyIdsError')
        setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <Card className="flex flex-col gap-3 text-white">
        <p className="font-semibold text-sm text-gray-300">Buy IDs</p>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            min={1}
            placeholder="e.g 2"
            value={count === 0 ? '' : count}
            onChange={handleChange}
            className="bg-transparent border border-white/20 rounded-md px-3 py-2 text-white placeholder:text-gray-400 outline-none w-48"
          />
          <button
            onClick={handleBuy}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md"
          >
            Buy
          </button>
        </div>
        <p className="text-xs text-gray-400">Enter a number greater than 1 then press Buy.</p>
      </Card>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
          <Card className="max-w-sm w-full">
            <p className="text-white font-semibold mb-4">Are you sure to buy ids</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowConfirm(false)}    disabled={loading} className={`px-3 py-2 rounded-md bg-white/10 text-white ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>Cancel</button>
              <button onClick={confirmBuy}    disabled={loading} className={`px-3 py-2 flex gap-1 rounded-md bg-emerald-500 text-white ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>Sure  {loading && <SpinnerLoader />}</button>
            </div>
          </Card>
        </div>
      )}
 
    </div>
  );
};

export default BuyIds;

