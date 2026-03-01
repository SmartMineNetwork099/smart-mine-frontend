'use client'
import Image from "next/image";
import React, { useEffect, useState } from "react";
import HashLoader from "@/components/HashLoader";

type TableProps = {
    data: any[];
    loading?: boolean;
    paginationCurrentPage?: number;
    totalNumberOfNodesAtCurrentLevel?: number;
};

const StakingTable = ({ data, loading = true , paginationCurrentPage=1 , totalNumberOfNodesAtCurrentLevel=0 }: TableProps) => {
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
    const pageSize = 50; // Assuming 50 items per page
    return (
        <div className="overflow-x-auto w-full rounded-lg scrollbar-hidden">
            <table className="min-w-[500px] w-full text-sm border-collapse">
                <thead className="sticky top-0 z-10 bg-green-500 text-black">
                    <tr className="bg-green-500 text-black text-sm sm:text-base font-bold text-center">
                        <th className="px-4 py-2 w-[70px] sm:w-[100px]">Sno. <span className="sm:font-extrabold text-white">({totalNumberOfNodesAtCurrentLevel || 0})</span></th>
                        <th className="px-4 py-2 w-[140px] sm:w-[230px]">UserID</th>
                        <th className="px-4 py-2 w-[90px] sm:w-[100px] text-end">Staking</th>
                        <th className="px-4 py-2 w-[50px] sm:w-[100px]">Status</th>
                        <th className="px-4 py-2 w-[80px] sm:w-[130px]">Direct Team</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={responsiveColspan} className="!text-center py-6">
                                <div className="flex justify-center items-center">
                                    <HashLoader />
                                </div>
                            </td>
                        </tr>
                    ) : data && data.length > 0 ? (
                        data?.map((row: any, rowIndex: number) => (
                            <tr
                                key={rowIndex}
                                className="text-center text-white bg-neutral-800 odd:bg-neutral-900 text-xs sm:text-sm"
                            >
                                <td className="px-4 py-2 whitespace-nowrap">
                                     {(paginationCurrentPage - 1) * pageSize + rowIndex + 1}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">{row?._id ?? "-"}</td>
                                <td className="px-4 py-2 text-end whitespace-nowrap">
                                    {row?.wallet?.stakingAmount} $
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">{row?.status}</td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {row?.directTeam?.length ?? 0}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={responsiveColspan} className="text-center py-6">
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
