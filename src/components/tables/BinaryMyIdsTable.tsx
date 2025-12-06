'use client'
import Image from "next/image";
import React, { useEffect, useState } from "react";
import HashLoader from "@/components/HashLoader";
import { Button } from "rizzui";
import Pagination2 from "@/components/Pagination2";

type TableProps = {
    data: any[];
    loading?: boolean;
    currentPage?: number;
    totalPaginationPages ?: number;
    paginationCurrentPage ?: number;
    totalNumberOfNodesAtCurrentLevel ?: number;
    setPaginationCurrentPage ?: any;
};

const BinaryMyIdsTable = ({ data, loading = true , currentPage,totalPaginationPages =1,paginationCurrentPage = 0 , setPaginationCurrentPage=1,totalNumberOfNodesAtCurrentLevel  }: TableProps) => {
    const [selected, setSelected] = useState<any>("All");
    const [responsiveColspan, setResponsiveColspan] = useState<number>(2);
    
console.log("data in table", data);
console.log("totalPaginationPagestotalPaginationPages", totalPaginationPages);
    const options = [
        { label: "All", color: "bg-blue-500" },
        { label: "Complete", color: "bg-green-600" },
        { label: "InComplete", color: "bg-red-600" },
    ];

   // FILTER LOGIC (run only when currentPage === 10)
    const filteredData = currentPage === 10 
        ? data?.filter((row) => {
            if (selected === "Complete") return row?.completeUpgraded === true;
            if (selected === "InComplete") return row?.completeUpgraded === false;
            return true;
        })
        : data;

    // Handle Responsive 
    useEffect(() => {
        const handleResize = () => {
            setResponsiveColspan(window.innerWidth <= 640 ? 2 : 6);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    useEffect(() => {
     setPaginationCurrentPage(1)
    }, [currentPage]);

    return (
        <>
            <div className="overflow-x-auto w-full rounded-lg scrollbar-hidden max-h-[400px] md:max-h-[500px]">

               {/* Show Filters ONLY when currentPage === 10 */}
                {currentPage === 10 && filteredData?.length>=1 && (
                    <div className="flex flex-wrap gap-2 my-3">
                        {options.map((opt) => (
                            <Button
                                key={opt.label}
                                onClick={() => setSelected(opt.label)}
                                className={`
                                    p-1 sm:px-2 sm:py-1.5 text-[10px] sm:text-xs rounded-full font-semibold border-0
                                    transition-all duration-200 
                                    ${selected === opt.label
                                        ? `${opt.color} text-white shadow-md scale-105`
                                        : "bg-neutral-800 text-gray-300 hover:bg-neutral-700"}
                                `}
                            >
                                {opt.label}
                            </Button>
                        ))}
                    </div>
                )}


                {/* Table */}
                <table className="min-w-[700px] w-full text-sm border-collapse">
                    <thead className="sticky top-0 z-10 bg-green-500 text-black">
                        <tr className="bg-green-500 text-black font-bold text-center">
                            <th className="px-4 py-2 w-[70px] sm:w-[100px]">Sno. <span className="font-extrabold">({totalNumberOfNodesAtCurrentLevel || 0})</span></th>
                            <th className="px-4 py-2 w-[200px] sm:w-[230px]">NodeID</th>
                            <th className="px-4 py-2 w-[200px] sm:w-[230px]">Position</th>
                            <th className="px-4 py-2 w-[100px] text-end">Staking</th>
                            <th className="px-4 py-2 w-[100px]">Level</th>
                            <th className="px-4 py-2 w-[100px]">Status</th>
                            <th className="px-4 py-2 w-[110px] sm:w-[130px]">Direct Team</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        
                        {loading ? (
                            <tr>
                                <td colSpan={responsiveColspan} className="!text-center py-6">
                                    <div className="flex justify-center items-center">
                                        <HashLoader />
                                    </div>
                                </td>
                            </tr>
                        ) : filteredData && filteredData.length > 0 ? (
                            filteredData?.map((row: any, rowIndex: number) =>
                            {
                                const pageSize = 50; // Assuming 50 items per page
                               return (
                                <tr
                                    key={rowIndex}
                                    className="text-center text-white bg-neutral-800 odd:bg-neutral-900 text-xs sm:text-sm"
                                >
                                    <td className="px-4 py-2 whitespace-nowrap">
                                         {(paginationCurrentPage - 1) * pageSize + rowIndex + 1}
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">{row?._id ?? "-"}</td>
                                    <td className="px-4 py-2 whitespace-nowrap">{row?.position ?? "-"}</td>
                                    <td className="px-4 py-2 text-end whitespace-nowrap">
                                        {row?.packageAmount} $
                                    </td>
                                    <td className="px-4 py-2 whitespace-nowrap">Beginer</td>

                                    {/* Status Badge */}
                                    <td className="px-4 py-2 whitespace-nowrap">
                                        <span
                                            className={`
                                                px-3 py-1 rounded-full text-xs font-semibold
                                                ${row?.completeUpgraded
                                                    ? "bg-green-600 text-white"
                                                    : "bg-red-600 text-white"}
                                            `}
                                        >
                                            {row?.completeUpgraded ? "Complete" : "InComplete"}
                                        </span>
                                    </td>

                                    <td className="px-4 py-2 whitespace-nowrap">
                                        {row?.directTeam?.length ?? 0}
                                    </td>
                                </tr>
                            )})
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

              {/* PAGINATION */}
      {totalPaginationPages > 1 && (
        <Pagination2
          currentPage={paginationCurrentPage}
          totalPages={totalPaginationPages}
          onPageChange={setPaginationCurrentPage}
        />
      )}
        </>
    );
};

export default BinaryMyIdsTable;
