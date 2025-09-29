'use client'
import React from "react";

const data = [
    { rank: 'Beginner 5', teamMembers: '2', totalIncome: '10', directMembers: 0 },
    { rank: 'Influencer 10', teamMembers: '4', totalIncome: '40', directMembers: 1 },
    { rank: 'Achiever 20', teamMembers: '8', totalIncome: '160', directMembers: 5 },
    { rank: 'Ambassador 40', teamMembers: '16', totalIncome: '640', directMembers: 10 },
    { rank: 'Pioneer 80', teamMembers: '32', totalIncome: '2,560', directMembers: 10 },
    { rank: 'Mentor 160', teamMembers: '64', totalIncome: '10,240', directMembers: 20 },
    { rank: 'Champion 320', teamMembers: '128', totalIncome: '40,960', directMembers: 20 },
    { rank: 'Director 640', teamMembers: '256', totalIncome: '163,840', directMembers: 20 },
    { rank: 'Titan 1,280', teamMembers: '512', totalIncome: '655,360', directMembers: 20 },
    { rank: 'Icon 2,560', teamMembers: '1,024', totalIncome: '2,621,440', directMembers: 20 },
    { rank: 'Legend 5,120', teamMembers: '2,048', totalIncome: '10,485,760', directMembers: 40 },
    { rank: 'Emperor 10,240', teamMembers: '4,096', totalIncome: '41,943,040', directMembers: 40 },
    { rank: 'Conqueror 20,480', teamMembers: '8,192', totalIncome: '167,772,160', directMembers: 40 },
    { rank: 'Chancellor 40,960', teamMembers: '16,384', totalIncome: '671,088,640', directMembers: 40 },
    { rank: 'Creator 81,920', teamMembers: '32,768', totalIncome: '2,684,354,560', directMembers: 40 },
];

const PlansTable = () => {
    const getRankParts = (rank: string) => {
        const parts = rank.split(" ");
        const name = parts.slice(0, parts.length - 1).join(" ");
        const amount = parts[parts.length - 1];
        return { name, amount };
    };

    return (
        <div className="overflow-x-auto w-full rounded-lg scrollbar-hidden">
            <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0 z-10 bg-green-500 text-black">
                    <tr className="bg-green-500 text-black font-bold text-center">
                        <th className="px-4 py-2">Rank</th>
                        <th className="px-4 py-2">Team Members</th>
                        <th className="px-4 py-2">Total Income</th>
                        <th className="px-4 py-2">Direct Members</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data?.map((row: any, rowIndex: number) => {
                            const { name, amount } = getRankParts(row?.rank);
                            return (
                                <tr
                                    key={rowIndex}
                                    className="text-center text-white bg-neutral-800 odd:bg-neutral-900 text-xs sm:text-sm"
                                >
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {name}{" "}
                                        <span className="px-1 text-green-500 font-bold ">
                                            {amount} $
                                        </span>
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">{row?.teamMembers}</td>
                                    <td className="px-4 py-2 text-end whitespace-nowrap">{row?.totalIncome} $</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{row?.directMembers}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    );
};

export default PlansTable;
