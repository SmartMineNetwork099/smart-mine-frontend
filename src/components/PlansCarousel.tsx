'use client'
import React, { useState } from "react";
import Card from "@/components/Card";
import { SiTether } from "react-icons/si";
import { FaCheck } from "react-icons/fa";
import Model from "@/components/Model";
import { buyPlans } from "@/apis/plans";
import Loading from "@/components/Loading";
import { toast } from "react-toastify";
import { getUserIdFromWallet } from "@/utils/walletHelpers";
import { Loader } from "rizzui";



// const plans = [
//     { name: "Beginner", amount: 5 },
//     { name: "Influencer", amount: 10 },
//     { name: "Achiever", amount: 20 },
//     { name: "Ambassador", amount: 40 },
//     { name: "Pioneer", amount: 80 },
//     { name: "Mentor", amount: 160 },
//     { name: "Champion", amount: 320 },
//     { name: "Director", amount: 640 },
//     { name: "Titan", amount: 1280 },
//     { name: "Icon", amount: 2560 },
//     { name: "Legend", amount: 5120 },
//     { name: "Emperor", amount: 10240 },
//     { name: "Conqueror", amount: 20480 },
//     { name: "Chancellor", amount: 40960 },
//     { name: "Creator", amount: 81920 },
// ];

const PlansCarousel = ({ plans, loading }: any) => {
    const [selectedPlans, setSelectedPlans] = useState([]);
    const [modelOpen, setModelOpen] = useState(false);
    const [loadingBuy, setLoadingBuy] = useState(false);


    const togglePlan = (plan: any) => {
        setSelectedPlans((prev: any) => {
            const exists = prev.find((p: any) => p.name === plan.name);
            if (exists) {
                return prev.filter((p: any) => p.name !== plan.name);
            } else {
                return [...prev, plan];
            }
        });
    };
    const handleModelOpen = () => {
        setModelOpen(true);
    }

    const totalAmount = selectedPlans.reduce((sum: any, p: any) => sum + p.amount, 0);
    const handleBuyPlan = async () => {
        if (selectedPlans.length === 0) {
            toast.error("Please select at least one plan to buy.");
            return;
        }
        console.log('Buying plans:', selectedPlans);
        try {
            setLoadingBuy(true);
            const userId = getUserIdFromWallet();
            const plansToBuy = selectedPlans?.map((p: any) => ({
                planId: p?._id,
                clientAmount: p?.amount,
            }));

            const { data, error } = await buyPlans(userId, plansToBuy);

            if (error) {
                toast.error(error);
            } else {
                toast.success("Plan(s) purchased successfully!");
                console.log("✅ Response:", data);
                setSelectedPlans([]);
                setModelOpen(false);
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong. Try again.");
        }
        finally{
            setLoadingBuy(false);
        }
        // const buyPlan = await buyPlans('643b8f4f3b4e2c001f6e4b9a')
        // console.log(buyPlan, 'buyPlanbuyPlan')
    }
    console.log(plans, 'plansplansplans')
    return (
        <>
            <Card>
                <section className="w-full py-0">
                    {
                        plans?.length > 0 ?
                            <div className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hidden">
                                {
                                    plans?.map((plan: any, i: any) => {
                                        const isSelected = selectedPlans.some((p: any) => p.name === plan.name);
                                        return (
                                            <div
                                                key={i}
                                                className={`min-w-[100px] sm:min-w-[180px] rounded-full shadow-md p-3 sm:p-8 flex flex-col items-center gap-1 sm:gap-2 
    ${plan.isPurchased ? 'bg-gray-500 opacity-60 cursor-not-allowed' : 'bg-neutral-700 cursor-pointer'}
  `}
                                                onClick={() => !plan.isPurchased && togglePlan(plan)}  // disable click if purchased
                                            >
                                                <p className="sm:text-2xl font-bold text-white">${plan.amount}</p>

                                                <button
                                                    className={`text-xs sm:text-xl font-semibold flex items-center gap-0.5 sm:gap-2 
      ${plan.isPurchased ? 'text-yellow-400' : 'text-green-500'}
    `}
                                                >
                                                    {plan.name}
                                                    {/* Purchased → show double tick, Selected → single tick */}
                                                    {plan.isPurchased ? (
                                                        <>
                                                            <FaCheck /><FaCheck />
                                                        </>
                                                    ) : (
                                                        isSelected && <FaCheck />
                                                    )}
                                                </button>

                                                <SiTether className="text-xl sm:text-3xl text-green-500" />
                                            </div>

                                        );
                                    })

                                }
                            </div>
                            :
                            loading && (
                                <div className="flex justify-center items-center">
                                    <Loading />
                                </div>
                            )
                    }

                    {/* Bottom Summary (Show only if at least one selected) */}
                    {selectedPlans.length > 0 && (
                        <div className="mt-6 flex flex-col items-center gap-4">
                            <p className="text-lg font-semibold text-white">
                                Total Price : ${totalAmount}
                            </p>
                            <button onClick={handleModelOpen} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-lg font-bold w-[80%] sm:w-[60%]">
                                Upgrade
                            </button>
                        </div>
                    )}
                    {/* Model Summary (Show for confirmation) */}
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
                </section>
            </Card>
        </>
    );
};

export default PlansCarousel;
