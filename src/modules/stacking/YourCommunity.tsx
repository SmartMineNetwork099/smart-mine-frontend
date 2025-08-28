'use client'
import React  from 'react'
import Table from '@/components/Table';

type Employee = {
    level: string;
    team: string;
    teamStaking: string;
    levelIncome: string;
    levelWasteIncome: string;
};

type Column = {
    key: keyof Employee;
    label: string;
};

const employees: Employee[] = [
    { level: "1", team: "3", teamStaking: "20$", levelIncome: "40$", levelWasteIncome: "7$" },
    { level: "2", team: "5", teamStaking: "35$", levelIncome: "60$", levelWasteIncome: "10$" },
    { level: "3", team: "8", teamStaking: "50$", levelIncome: "80$", levelWasteIncome: "12$" },
    { level: "4", team: "12", teamStaking: "70$", levelIncome: "100$", levelWasteIncome: "15$" },
    { level: "5", team: "18", teamStaking: "90$", levelIncome: "130$", levelWasteIncome: "20$" },
    { level: "6", team: "25", teamStaking: "120$", levelIncome: "160$", levelWasteIncome: "25$" },
    { level: "7", team: "33", teamStaking: "150$", levelIncome: "200$", levelWasteIncome: "30$" },
    { level: "8", team: "42", teamStaking: "180$", levelIncome: "230$", levelWasteIncome: "35$" },
    { level: "9", team: "52", teamStaking: "210$", levelIncome: "260$", levelWasteIncome: "40$" },
    { level: "10", team: "63", teamStaking: "240$", levelIncome: "300$", levelWasteIncome: "45$" },
    { level: "11", team: "75", teamStaking: "270$", levelIncome: "340$", levelWasteIncome: "50$" },
    { level: "12", team: "88", teamStaking: "300$", levelIncome: "380$", levelWasteIncome: "55$" },
    { level: "13", team: "102", teamStaking: "330$", levelIncome: "420$", levelWasteIncome: "60$" },
    { level: "14", team: "117", teamStaking: "360$", levelIncome: "460$", levelWasteIncome: "65$" },
    { level: "15", team: "133", teamStaking: "400$", levelIncome: "500$", levelWasteIncome: "70$" },
];


const columns: Column[] = [
    { key: "level", label: "Level" },
    { key: "team", label: "Team" },
    { key: "teamStaking", label: "Team Staking" },
    { key: "levelIncome", label: "Level Income" },
    { key: "levelWasteIncome", label: "Level Waste Income" },
];

const YourCommunity = () => {
    return (
        <div className='h-screen p-4'>
            <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white mb-4'>
                Your <span className='text-green-500'>Community</span>
            </p>
            <Table data={employees} columns={columns} />
        </div>
    )
}

export default YourCommunity
