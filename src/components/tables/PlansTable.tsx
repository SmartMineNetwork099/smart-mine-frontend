'use client'
import React, { useState, useEffect } from "react";
import HashLoader from "@/components/HashLoader";
import Image from "next/image";

// const plans = [
//     { name: 'Beginner', teamMembers: '2', totalIncome: '10', upgrade: '10', netProfit: '0', loss: '0', directMembers: 0 },
//     { name: 'Influencer', teamMembers: '4', totalIncome: '40', upgrade: '20', netProfit: '20', loss: '0', directMembers: 1 },
//     { name: 'Achiever', teamMembers: '8', totalIncome: '160', upgrade: '40', netProfit: '120', loss: '0', directMembers: 5 },
//     { name: 'Ambassador', teamMembers: '16', totalIncome: '640', upgrade: '80', netProfit: '560', loss: '0', directMembers: 10 },
//     { name: 'Pioneer', teamMembers: '32', totalIncome: '2,560', upgrade: '160', netProfit: '2,400', loss: '0', directMembers: 10 },
//     { name: 'Mentor', teamMembers: '64', totalIncome: '10,240', upgrade: '320', netProfit: '9,920', loss: '0', directMembers: 20 },
//     { name: 'Champion', teamMembers: '128', totalIncome: '40,960', upgrade: '640', netProfit: '40,320', loss: '0', directMembers: 20 },
//     { name: 'Director', teamMembers: '256', totalIncome: '163,840', upgrade: '1,280', netProfit: '162,560', loss: '0', directMembers: 20 },
//     { name: 'Titan', teamMembers: '512', totalIncome: '655,360', upgrade: '2,560', netProfit: '652,800', loss: '0', directMembers: 20 },
//     { name: 'Icon', teamMembers: '1,024', totalIncome: '2,621,440', upgrade: '5,120', netProfit: '2,616,320', loss: '0', directMembers: 20 },
//     { name: 'Legend', teamMembers: '2,048', totalIncome: '10,485,760', upgrade: '10,240', netProfit: '10,475,520', loss: '0', directMembers: 40 },
//     { name: 'Emperor', teamMembers: '4,096', totalIncome: '41,943,040', upgrade: '20,480', netProfit: '41,922,560', loss: '0', directMembers: 40 },
//     { name: 'Conqueror', teamMembers: '8,192', totalIncome: '167,772,160', upgrade: '40,960', netProfit: '167,731,200', loss: '0', directMembers: 40 },
//     { name: 'Chancellor', teamMembers: '16,384', totalIncome: '671,088,640', upgrade: '81,920', netProfit: '671,006,720', loss: '0', directMembers: 40 },
//     { name: 'Creator', teamMembers: '32,768', totalIncome: '2,684,354,560', upgrade: '163,840', netProfit: '2,684,190,720', loss: '0', directMembers: 40 },
// ];

const PlansTable = ({ plans, loading }: any) => {

    const [responsiveColspan, setResponsiveColspan] = useState<number>(2);

    // ✅ useEffect for fetching + resize
    useEffect(() => {
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleResize = () => {
        setResponsiveColspan(window.innerWidth <= 640 ? 2 : 7);
    };

    return (
        <div className="overflow-x-auto w-full rounded-lg scrollbar-hidden">
            <table className="min-w-[950px]  w-full text-sm border-collapse">
                <thead className="sticky top-0 z-10 bg-green-500 text-black">
                    <tr className="font-bold text-center">
                        <th className="px-4 py-2 w-[40px] sm:w-[80px] ">Sr.no</th>
                        <th className="px-4 py-2 w-[95px] sm:w-[150px]">Rank</th>
                        <th className="px-4 py-2 w-[100px] sm:w-[110px] ">Team Members</th>
                        <th className="px-4 py-2 w-[90px] sm:w-[100px] text-end ">Plan Price</th>
                        <th className="px-4 py-2 w-[120px] sm:w-[130px] text-end  ">Next Plan Price</th>
                        <th className="px-4 py-2 w-[120px] sm:w-[100px] text-end">Total Income</th>
                        <th className="px-4 py-2 w-[110px] sm:w-[100px] text-end">Net Profit</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={responsiveColspan} className="text-center py-6">
                                <div className="flex justify-center items-center">
                                    <HashLoader />
                                </div>
                            </td>
                        </tr>
                    ) : plans.length > 0 ? (
                        plans?.map((row: any, i: number) => (
                            <tr
                                key={i}
                                className="text-center text-white bg-neutral-800 odd:bg-neutral-900 text-xs sm:text-sm"
                            >
                                <td className="p-4 whitespace-nowrap text-center">{i + 1}</td>
                                <td className="p-4 whitespace-nowrap text-center">{row?.name}</td>
                                <td className="p-4 whitespace-nowrap">{row?.teamMembers}</td>
                                <td className="p-4 text-end whitespace-nowrap">{row?.price} $</td>
                                <td className="p-4 text-end whitespace-nowrap">{row?.nextPlanPrice} $</td>
                                <td className="p-4 text-end whitespace-nowrap">{row?.maxIncome} $</td>
                                <td className="p-4 text-end whitespace-nowrap">{row?.netProfit} $</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={responsiveColspan} className="text-center py-6">
                                <Image
                                    src="/undraw_no_data_found.svg"
                                    className="mx-auto w-28 sm:w-40 h-28 sm:h-40"
                                    alt="No data found"
                                    width={160}
                                    height={160}
                                />
                                <p className="text-white mt-2 font-bold">No Data Found</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};


export default PlansTable;
