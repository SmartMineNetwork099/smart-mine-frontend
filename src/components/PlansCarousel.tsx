'use client'
import React, { useState } from "react";
import Card from "@/components/Card";
import { SiTether } from "react-icons/si";
import { FaCheck } from "react-icons/fa";
import Model from "@/components/Model";


const data = [
    { rank: "Beginner", amount: 5 },
    { rank: "Influencer", amount: 10 },
    { rank: "Achiever", amount: 20 },
    { rank: "Ambassador", amount: 40 },
    { rank: "Pioneer", amount: 80 },
    { rank: "Mentor", amount: 160 },
    { rank: "Champion", amount: 320 },
    { rank: "Director", amount: 640 },
    { rank: "Titan", amount: 1280 },
    { rank: "Icon", amount: 2560 },
    { rank: "Legend", amount: 5120 },
    { rank: "Emperor", amount: 10240 },
    { rank: "Conqueror", amount: 20480 },
    { rank: "Chancellor", amount: 40960 },
    { rank: "Creator", amount: 81920 },
];

const PlansCarousel = () => {
    const [selectedPlans, setSelectedPlans] = useState([]);
    const [modelOpen, setModelOpen] = useState(false);


    const togglePlan = (plan: any) => {
        setSelectedPlans((prev: any) => {
            const exists = prev.find((p: any) => p.rank === plan.rank);
            if (exists) {
                return prev.filter((p:any) => p.rank !== plan.rank);
            } else {
                return [...prev, plan];
            }
        });
    };
    const handleModelOpen = () => {
        setModelOpen(true);
    }

    const totalAmount = selectedPlans.reduce((sum: any, p: any) => sum + p.amount, 0);

    return (
        <>
            <Card>
                <section className="w-full py-0">
                    {/* Scrollable Container */}
                    <div className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hidden">
                        {data?.map((plan, i) => {
                            const isSelected = selectedPlans.some((p: any) => p.rank === plan.rank);
                            return (
                                <div
                                    key={i}
                                    className={`min-w-[100px] sm:min-w-[180px] bg-white rounded-full shadow-md p-3 sm:p-8 flex flex-col items-center gap-1 sm:gap-2 cursor-pointer border-2 sm:border-5 ${isSelected ? ' border-green-500' : ' border-white'}`}
                                    onClick={() => togglePlan(plan)}
                                >
                                    <p className=" sm:text-2xl font-bold text-gray-900">${plan.amount}</p>
                                    <button className="text-xs sm:text-xl font-semibold flex items-center gap-0.5 sm:gap-2 text-green-500 -mt-1 sm:mt-0">{plan.rank}
                                          {isSelected && <FaCheck />}
                                          </button>
                                    <SiTether className="text-xl sm:text-3xl text-green-500" />
                                </div>
                            );
                        })}
                    </div>

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
                                <p className="text-black text-center">Are you sure want to purshase </p>
                                <div className="flex justify-center gap-4 mt-6">
                                    <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl text-lg font-bold">
                                        Buy
                                    </button>
                                    <button
                                        onClick={() => setModelOpen(false)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl text-lg font-bold"
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
