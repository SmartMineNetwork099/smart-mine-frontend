'use client'
import React from "react";

const plans = [
    { name: 'Beginner', teamMembers: '2', totalIncome: '10', upgrade: '10', netProfit: '0', loss: '0', directMembers: 0 },
    { name: 'Influencer', teamMembers: '4', totalIncome: '40', upgrade: '20', netProfit: '20', loss: '0', directMembers: 1 },
    { name: 'Achiever', teamMembers: '8', totalIncome: '160', upgrade: '40', netProfit: '120', loss: '0', directMembers: 5 },
    { name: 'Ambassador', teamMembers: '16', totalIncome: '640', upgrade: '80', netProfit: '560', loss: '0', directMembers: 10 },
    { name: 'Pioneer', teamMembers: '32', totalIncome: '2,560', upgrade: '160', netProfit: '2,400', loss: '0', directMembers: 10 },
    { name: 'Mentor', teamMembers: '64', totalIncome: '10,240', upgrade: '320', netProfit: '9,920', loss: '0', directMembers: 20 },
    { name: 'Champion', teamMembers: '128', totalIncome: '40,960', upgrade: '640', netProfit: '40,320', loss: '0', directMembers: 20 },
    { name: 'Director', teamMembers: '256', totalIncome: '163,840', upgrade: '1,280', netProfit: '162,560', loss: '0', directMembers: 20 },
    { name: 'Titan', teamMembers: '512', totalIncome: '655,360', upgrade: '2,560', netProfit: '652,800', loss: '0', directMembers: 20 },
    { name: 'Icon', teamMembers: '1,024', totalIncome: '2,621,440', upgrade: '5,120', netProfit: '2,616,320', loss: '0', directMembers: 20 },
    { name: 'Legend', teamMembers: '2,048', totalIncome: '10,485,760', upgrade: '10,240', netProfit: '10,475,520', loss: '0', directMembers: 40 },
    { name: 'Emperor', teamMembers: '4,096', totalIncome: '41,943,040', upgrade: '20,480', netProfit: '41,922,560', loss: '0', directMembers: 40 },
    { name: 'Conqueror', teamMembers: '8,192', totalIncome: '167,772,160', upgrade: '40,960', netProfit: '167,731,200', loss: '0', directMembers: 40 },
    { name: 'Chancellor', teamMembers: '16,384', totalIncome: '671,088,640', upgrade: '81,920', netProfit: '671,006,720', loss: '0', directMembers: 40 },
    { name: 'Creator', teamMembers: '32,768', totalIncome: '2,684,354,560', upgrade: '163,840', netProfit: '2,684,190,720', loss: '0', directMembers: 40 },
];




const PlansTable = () => {

    return (
        <div className="overflow-x-auto w-full rounded-lg scrollbar-hidden">
            <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0 z-10 bg-green-500 text-black">
                    <tr className="bg-green-500 text-black font-bold text-center">
                        <th className="px-4 py-2">Rank</th>
                        <th className="px-4 py-2">Team Members</th>
                        <th className="px-4 py-2 text-end">Total Income</th>
                        <th className="px-4 py-2 text-end">Upgrade</th>
                        <th className="px-4 py-2 text-end">NetProfit</th>
                        <th className="px-4 py-2">Direct Members</th>
                        <th className="px-4 py-2">Loss</th>
                    </tr>
                </thead>
                <tbody>
                    {plans?.map((row: any, rowIndex: number) => {
                        return (
                            <tr
                                key={rowIndex}
                                className="text-center text-white bg-neutral-800 odd:bg-neutral-900 text-xs sm:text-sm"
                            >
                                <td className="p-4 whitespace-nowrap text-center">{row?.name}</td>
                                <td className="p-4 whitespace-nowrap">{row?.teamMembers}</td>
                                <td className="p-4 text-end whitespace-nowrap">{row?.totalIncome} $</td>
                                <td className="p-4 text-end whitespace-nowrap">{row?.upgrade} $</td>
                                <td className="p-4 text-end whitespace-nowrap">{row?.netProfit} $</td>
                                <td className="p-4 whitespace-nowrap">{row?.directMembers}</td>
                                <td className="p-4 whitespace-nowrap text-end text-red-500 font-bold">{row?.loss} $</td>
                            </tr>
                        );
                    })}
                </tbody>

            </table>
        </div>
    );
};

export default PlansTable;
