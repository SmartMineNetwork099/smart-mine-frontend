'use client'
import { DEFAULT_CURRENCY } from "@/constants/currency";
import React from "react";

type Employee = {
    from: string;
    amount: string;
    incomeType: string;
    rankLevel: string;
    layer: string;
    time: string;
};

type Column<T> = {
    key: keyof T;
    label: string;
    render?: (value: any, row: T) => React.ReactNode; // optional custom renderer
};

type TableProps<T> = {
    data: T[];
};

const columns: Column<Employee>[] = [
    { key: "from", label: "From" },
    {
        key: "amount",
        label: "Amount",
        render: (value: string) => (
            <span className="text-green-500">
                {value} <span className="font-semibold">{DEFAULT_CURRENCY}</span>
            </span>
        ),
    },
    { key: "incomeType", label: "Income Type" },
    { key: "rankLevel", label: "Rank Level" },
    { key: "layer", label: "Layer" },
    { key: "time", label: "Time" },
];

const Table = ({ data }: TableProps<Employee>) => {
    return (
        <div className="overflow-auto w-full max-h-[400px] md:max-h-[500px] rounded-lg mt-4">
            <table className="table-fixed min-w-[600px] sm:min-w-[900px] w-full text-sm">
                <thead className="sticky top-0 z-10 bg-green-500 text-black">
                    <tr className="bg-green-500 text-black font-bold text-center">
                        {columns.map((col, i) => (
                            <th key={i} className="w-40 px-4 py-2">
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="text-center text-white bg-gray-600 odd:bg-gray-700">
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} className="px-4 py-2">
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
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
