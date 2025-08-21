"use client";
import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import Card from "@/components/Card";
import { IoLogoWhatsapp } from "react-icons/io5";
import {DEFAULT_SYMBOL} from "@/constants/currency";

type Deliverable = {
    id: number;
    level: string;
    team: number;
    staking: number;
    status: 'active' | 'not active';
    action: string;
    subtasks: Subtask[];
};

const deliverablesData: Deliverable[] = [
    {
        id: 1,
        level: "Level 1",
        team: 3,
        staking: 30,
        status: 'active',
        action: "WhatsApp",
        subtasks: [
            { id: 123456789, name: "ali", staking: 10, status: "active", number: "+921234567890" },
            { id: 12, name: "hassan", staking: 10, status: "not active", number: "+921234567890" },
            { id: 13, name: "naveed", staking: 10, status: "active", number: "+921234567890" },
        ],
    },
    {
        id: 2,
        level: "Level 2",
        team: 3,
        staking: 30,
        status: 'active',
        action: "WhatsApp",
        subtasks: [
            { id: 11, name: "ali", staking: 10, status: "active", number: "N/A" },
            { id: 12, name: "hassan", staking: 10, status: "not active", number: "N/A" },
            { id: 13, name: "naveed", staking: 10, status: "active", number: "N/A" },

        ],
    },
    {
        id: 3,
        level: "Level 3",
        team: 3,
        staking: 30,
        status: 'active',
        action: "WhatsApp",
        subtasks: [
            { id: 11, name: "ali", staking: 10, status: "active", number: "N/A" },
            { id: 12, name: "hassan", staking: 10, status: "not active", number: "N/A" },
            { id: 13, name: "naveed", staking: 10, status: "active", number: "N/A" },

        ],
    },
    {
        id: 4,
        level: "Level 4",
        team: 3,
        staking: 30,
        status: 'active',
        action: "WhatsApp",
        subtasks: [
            { id: 11, name: "ali", staking: 10, status: "active", number: "N/A" },
            { id: 12, name: "hassan", staking: 10, status: "not active", number: "N/A" },
            { id: 13, name: "naveed", staking: 10, status: "active", number: "N/A" },

        ],
    },

];



// Types for deliverables and subtasks
type Subtask = {
    id: number;
    name: string;
    staking: number;
    status: 'active' | 'not active';
    number: string;
};

const YourCommunity = () => {
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [subtaskFilter, setSubtaskFilter] = useState<'all' | 'active' | 'not active'>('all');
    const toggleRow = (id: number) => {
        setExpandedRows((prev: number[]) =>
            prev.includes(id) ? prev.filter((rowId: number) => rowId !== id) : [...prev, id]
        );
    };
    return (
        <>
            <div className='mt-6 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white'>Your <span className='text-green-500'>Community</span></p>
                <div className="max-w-52">
                    <select
                        value={subtaskFilter}
                        onChange={e => setSubtaskFilter(e.target.value as 'all' | 'active' | 'not active')}
                        className="rounded px-3 py-2 text-sm border-2 text-white border-green-500 focus:outline-none focus:ring-0 focus:ring-green-500"
                    >
                        <option className="text-black" value="all">All</option>
                        <option className="text-black" value="active">Active</option>
                        <option className="text-black" value="not active">Not Active</option>
                    </select>
                </div>
            </div>
            <Card className="w-full overflow-x-auto">
                <table className="min-w-[600px] w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="">
                        <tr>
                            <th className="px-4 py-3 text-left font-bold text-lg min-w-40">Level</th>
                            <th className="px-4 py-3 text-center font-bold text-lg min-w-36">Team</th>
                            <th className="px-4 py-3 text-center font-bold text-lg min-w-36">Staking</th>
                            <th className="px-4 py-3 text-center font-bold text-lg min-w-36">Status</th>
                            <th className="px-4 py-3 text-center font-bold text-lg min-w-52">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deliverablesData?.map((deliverable) => {
                            const activeMembers = deliverable.subtasks.filter((subtask) => subtask.status === 'active').length;
                            // const inactiveMembers = deliverable.subtasks.filter((subtask) => subtask.status !== 'active').length;
                            return (
                                <React.Fragment key={deliverable.id}>
                                    <tr className=" border-b transition" >
                                        <td className="px-4 py-3 flex items-center gap-2 cursor-pointer" onClick={() => toggleRow(deliverable?.id)}>
                                            <button

                                                className="focus:outline-none"
                                            >
                                                {expandedRows.includes(deliverable?.id) ? (
                                                    <FaChevronDown className="text-green-500" />
                                                ) : (
                                                    <FaChevronRight className="text-green-500" />
                                                )}
                                            </button>
                                            <span className="font-medium text-white">{deliverable?.level}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-white">{deliverable?.team}</td>
                                        <td className="px-4 py-3 text-center text-green-500">{DEFAULT_SYMBOL} {deliverable?.staking.toLocaleString()}</td>
                                        <td className={`px-4 py-3 text-center ${deliverable?.status === 'active' ? 'text-green-500' : 'text-red-600'}`}>{deliverable?.status} <span className="font-bold border border-green-500 rounded-full p-1">{` ${activeMembers} `}</span></td>
                                        <td className="px-4 py-3 text-center">
                                            <button className="px-3 py-1 rounded transition">
                                                <IoLogoWhatsapp className="inline-block mr-1 text-blue-500 text-xl" />
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={5} className="p-0 border-0">
                                            <div
                                                className={`transition-all duration-500 ease-in-out overflow-hidden bg-[#1a2236] ${expandedRows.includes(deliverable.id) ? 'max-h-96 opacity-100 py-2' : 'max-h-0 opacity-0 py-0'}`}
                                            >
                                                <table className="w-full">
                                                    <tbody>
                                                        {deliverable.subtasks
                                                            .filter(subtask =>
                                                                subtaskFilter === 'all' ? true : subtask.status === subtaskFilter
                                                            )
                                                            .map((subtask) => (
                                                                <tr key={subtask.id} className="border-b border-gray-700 last:border-b-0">
                                                                    <td className="px-4 py-2 flex items-center gap-2 text-white min-w-40"><span className="text-green-500">↳</span>{subtask?.id}</td>
                                                                    <td className="px-4 py-2 text-center text-white min-w-36">{subtask?.name}</td>
                                                                    <td className="px-4 py-2 text-center text-green-500 min-w-36">{DEFAULT_SYMBOL} {subtask?.staking}</td>
                                                                    <td className={`px-4 py-2 text-center min-w-36 ${subtask?.status === 'active' ? 'text-green-500' : 'text-red-600'}`}>{subtask?.status}</td>
                                                                    <td className="px-4 py-2 text-center min-w-52">
                                                                        <button className="px-2 py-1 rounded cursor-pointer text-white">
                                                                            {subtask?.number} <IoLogoWhatsapp className="inline-block mx-1 text-blue-500 text-xl -mt-2" />
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                </React.Fragment>
                            )
                        })}
                    </tbody>
                </table>
            </Card>

        </>
    );
};

export default YourCommunity;
