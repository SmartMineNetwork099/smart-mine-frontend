'use client'
import React from "react";

type Column<T> = {
    key: keyof T;
    label: string;
    width?: string;
};

type TableProps<T> = {
    data: T[];
    columns: Column<T>[];
};

const Table = <T extends object>({ data, columns }: TableProps<T>) => {
    return (
        <div className="overflow-auto w-full max-h-[400px] md:max-h-[500px] rounded-lg my-4 scrollbar-hidden">
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
                    {data.map((row, rowIndex) => (
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
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
