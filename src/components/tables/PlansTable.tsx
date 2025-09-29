'use client'
import React, { useEffect, useState } from "react";

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
    const [responsiveColspan, setResponsiveColspan] = useState<number>(2)
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
        <div className="overflow-x-auto w-full rounded-lg scrollbar-hidden border border-red-500">
            <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0 z-10 bg-green-500 text-black">
                    <tr className="bg-green-500 text-black font-bold text-center">
                        <th className="px-4 py-2 border border-red-500">Rank</th>
                        <th className="px-4 py-2 border border-red-500">Team Members</th>
                        <th className="px-4 py-2 border border-red-500">Total Income</th>
                        <th className="px-4 py-2 border border-red-500">Direct Members</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data?.map((row: any, rowIndex: number) => (
                            <tr
                                key={rowIndex}
                                className="text-center text-white bg-neutral-800 odd:bg-neutral-900 text-xs sm:text-sm"
                            >
                                <td className="px-4 py-2 whitespace-nowrap border border-red-500">{row?.rank}</td>
                                <td className="px-4 py-2 whitespace-nowrap border border-red-500">{row?.teamMembers}</td>
                                <td className="px-4 py-2 text-end whitespace-nowrap border border-red-500">{row?.totalIncome} $</td>
                                <td className="px-4 py-2 whitespace-nowrap border border-red-500">{row?.directMembers}</td>

                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

export default PlansTable;
