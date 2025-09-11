'use client'
import Image from "next/image";
import React from "react";
import { l } from "rizzui/label-size-BLtICllx";
import Loading from "@/components/Loading";

type Column<T> = {
    key: keyof T;
    label: string;
    width?: string;
};

type TableProps<T> = {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
};

const Table = <T extends object>({ data, columns, loading = true }: TableProps<T>) => {
    return (
        <div className="overflow-auto w-full rounded-lg scrollbar-hidden">
            {/* <div className="overflow-auto w-full max-h-[400px] md:max-h-[500px] rounded-lg my-4 scrollbar-hidden"> */}
            <table className="table-fixed  w-full text-sm">
                <thead className="sticky top-0 z-10 bg-green-500 text-black">
                    <tr className="bg-green-500 text-black font-bold text-center">
                        {columns.map((col, i) => (
                            <th key={i} className={`${col?.width} sm:w-40 px-1 sm:px-4 py-2 text-xs sm:text-sm`}>
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length} className="!text-center py-6">
                                <div className="flex justify-center items-center">
                                    <Loading />
                                </div>
                            </td>
                        </tr>
                    ) : data && data?.length > 0 ? (
                        data?.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="text-center text-white bg-gray-600 odd:bg-gray-700"
                            >
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} className="px-4 py-2">
                                        {row[col.key] as React.ReactNode}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-6">
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

export default Table;
