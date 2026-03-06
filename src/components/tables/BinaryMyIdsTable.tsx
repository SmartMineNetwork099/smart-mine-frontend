'use client'
import Image from "next/image";
import React, { useEffect, useState } from "react";
import HashLoader from "@/components/HashLoader";
import { Button } from "rizzui";
import Pagination2 from "@/components/Pagination2";
import Model from "@/components/Model";
import MyIdsDetail from "@/modules/binary/myIds/MyIdsDetail";


type TableProps = {
    data: any[];
    loading?: boolean;
    currentPage?: number;
    totalPaginationPages ?: number;
    paginationCurrentPage ?: number;
    totalNumberOfNodesAtCurrentLevel ?: number;
    setPaginationCurrentPage ?: any;
};

const BinaryMyIdsTable = ({ data, loading = false , currentPage,totalPaginationPages =1,paginationCurrentPage = 1 , setPaginationCurrentPage=1,totalNumberOfNodesAtCurrentLevel  }: TableProps) => {
    const [selected, setSelected] = useState<any>("All");
    const [responsiveColspan, setResponsiveColspan] = useState<number>(2);
    const [modelOpen, setModelOpen] = useState(false);
    const [userID, setUserID] = useState('');
    const [nodeID, setNodeID] = useState('');
    const [position, setPosition] = useState(null);

    
    
console.log("data in table", data);
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
     const handleModelOpen = (userID:any , nodeID:any , position:any ) => {
        console.log("userIDnodeIDuserIDnodeID", userID , nodeID);
        setUserID(userID);
        setNodeID(nodeID);
        setPosition(position);
        setModelOpen(true);
    }

    /////////////////////////////////////////////////////////////

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
                <table className={`${currentPage === 10 ? 'min-w-[520px]' : 'min-w-[450px]'} w-full text-sm border-collaps`}>
                    <thead className="sticky top-0 z-10 bg-green-500 text-black">
                        <tr className="bg-green-500 text-black text-xs sm:text-base font-bold text-center">
                            <th className="px-2 sm:px-4 py-2 w-[50px] sm:w-[100px]">Sno. <span className="font-bold sm:font-extrabold text-white">({totalNumberOfNodesAtCurrentLevel || 0})</span></th>
                            <th className="px-2 sm:px-4 py-2 w-[50px] sm:w-[130px]">ID</th>
                            {/* <th className="px-2 sm:px-4 py-2 w-[80px] sm:w-[120px] ">Position</th> */}
                            <th className="px-2 sm:px-4 py-2 w-[60px] sm:w-[100px]">Level</th>
                            {/* <th className="px-2 sm:px-4 py-2 w-[50px] sm:w-[150px]">Total Income</th> */}
                            <th className="px-2 sm:px-4 py-2 w-[50px] sm:w-[150px]">Net Profit</th>
                            {currentPage === 10 && 
                            <th className="px-2 sm:px-4 py-2 w-[80px] sm:w-[100px]">Status</th>
                            }
                            <th className="px-2 sm:px-4 py-2 w-[80px] sm:w-[160px]">Cumminity Size</th>
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
                               console.log("row data", row);
                                return (
                                <tr
                                    key={rowIndex}
                                    onClick={() => handleModelOpen(row?.userId , row?._id , row?.position)}
                                    className="text-center text-white bg-neutral-700/5 odd:bg-neutral-700/70 text-xs sm:text-sm"
                                >
                                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                                         {(paginationCurrentPage - 1) * pageSize + rowIndex + 1}
                                    </td>
                                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{row?.base36NodeId ?? "-"}</td>
                                    {/* <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{row?.position ?? "-"}</td> */}
                                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{row?.planName ?? 'N/A'}</td>
                                    {/* <td className={`px-2 sm:px-4 py-2 whitespace-nowrap ${responsiveColspan===2 && 'text-end'}`}>{Number(row?.earnedIncome) ?? 0}$</td> */}
                                    <td className={`px-2 sm:px-4 py-2 whitespace-nowrap ${responsiveColspan===2 && 'text-end'}`}>{Number(row?.netEarnedIncome) ?? 0}$</td>
                                     {currentPage === 10 && (
                                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
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
                                      )
                                    }

                                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap">
                                        {row?.belowTotalNodes ?? 0}
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




                  {/* Model Summary (Show for confirmation) */}
                    {modelOpen && (
                        <Model isOpen={modelOpen} onClose={() => setModelOpen(false)} title={`ID Details`} className="!bg-gray-200"  size = "xl">
                           <MyIdsDetail userID={userID}  nodeID={nodeID} position={position}/>
                        </Model>
                    )}








              {/* PAGINATION */}
      {totalPaginationPages > 1 && !loading && (
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
