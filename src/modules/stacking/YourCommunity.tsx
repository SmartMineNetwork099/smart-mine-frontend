'use client'
import React from 'react'
import Table from '@/components/Table';

type Employee = {
    level: string;
    team: string;
    teamStaking: string;
};

type Column = {
    key: keyof Employee;
    label: string;
    width: string;
};

const employees: Employee[] = [
    { level: "1", team: "3", teamStaking: "20$" },
    { level: "2", team: "5", teamStaking: "35$" },
    { level: "3", team: "8", teamStaking: "50$" },
    { level: "4", team: "12", teamStaking: "70$" },
    { level: "5", team: "18", teamStaking: "90$" },
    { level: "6", team: "25", teamStaking: "120$" },
    { level: "7", team: "33", teamStaking: "150$" },
    { level: "8", team: "42", teamStaking: "180$" },
    { level: "9", team: "52", teamStaking: "210$" },
    { level: "10", team: "63", teamStaking: "240$" },
    { level: "11", team: "75", teamStaking: "270$" },
    { level: "12", team: "88", teamStaking: "300$" },
    { level: "13", team: "102", teamStaking: "330$" },
    { level: "14", team: "117", teamStaking: "360$" },
    { level: "15", team: "13390", teamStaking: "400000$" },
];


const columns: Column[] = [
    { key: "level", label: "Level", width: "w-8 sm:32" },
    { key: "team", label: "Team", width: "w-12 sm:32" },
    { key: "teamStaking", label: "Team Staking", width: "w-16 sm:32" },

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
