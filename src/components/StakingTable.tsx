'use client'
import Image from "next/image";
import React from "react";
import Loading from "@/components/Loading";

type TableProps = {
    data: any[];
    loading?: boolean;
};

const StakingTable = ({ data, loading = true }: TableProps) => {
    return (
        <div className="overflow-x-auto w-full rounded-lg scrollbar-hidden">
            <table className="min-w-[800px] w-full text-sm border-collapse">
                <thead className="sticky top-0 z-10 bg-green-500 text-black">
                    <tr className="bg-green-500 text-black font-bold text-center">
                        <th className="px-4 py-2 min-w-[150px]">Sno.</th>
                        <th className="px-4 py-2 min-w-[250px]">UserID</th>
                        <th className="px-4 py-2 min-w-[100px] text-end">Staking</th>
                        <th className="px-4 py-2 min-w-[150px]">Level</th>
                        <th className="px-4 py-2 min-w-[100px]">Status</th>
                        <th className="px-4 py-2 min-w-[150px]">DirectTeam</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={6} className="!text-center py-6">
                                <div className="flex justify-center items-center">
                                    <Loading />
                                </div>
                            </td>
                        </tr>
                    ) : data && data.length > 0 ? (
                        data?.map((row: any, rowIndex: number) => (
                            <tr
                                key={rowIndex}
                                className="text-center text-white bg-gray-600 odd:bg-gray-700"
                            >
                                <td className="px-4 py-2 whitespace-nowrap">{rowIndex + 1}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{row?._id ?? "-"}</td>
                                <td className="px-4 py-2 text-end whitespace-nowrap">
                                    {row?.wallet?.stakingAmount} $
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">Beginer</td>
                                <td className="px-4 py-2 whitespace-nowrap">{row?.status}</td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {row?.directTeam?.length ?? 0}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="text-center py-6">
                                <Image
                                    src="/undraw_no_data_found.svg"
                                    className="mx-auto w-28 sm:w-40 h-28 sm:h-40"
                                    alt="No data found image"
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

export default StakingTable;
