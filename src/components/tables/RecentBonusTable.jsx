import React from 'react'
import { DEFAULT_CURRENCY } from "@/constants/currency";


const employees = [
    {
        from: "478687",
        amount: "0.00003",
        incomeType: "Layer Bonus",
        rankLevel: "Beginner",
        layer: "1",
        time: "2023-10-01 12:00",
    },
    {
        from: "563546",
        amount: "0.000055",
        incomeType: "Layer Bonus",
        rankLevel: "Beginner",
        layer: "4",
        time: "2023-10-01 12:00",
    },
    {
        from: "78337",
        amount: "0.00003",
        incomeType: "Layer Bonus",
        rankLevel: "Beginner",
        layer: "1",
        time: "2023-10-01 12:00",
    },
    {
        from: "563546",
        amount: "0.000055",
        incomeType: "Layer Bonus",
        rankLevel: "Beginner",
        layer: "4",
        time: "2023-10-01 12:00",
    },
    {
        from: "78337",
        amount: "0.00003",
        incomeType: "Layer Bonus",
        rankLevel: "Beginner",
        layer: "1",
        time: "2023-10-01 12:00",
    },
    {
        from: "563546",
        amount: "0.000055",
        incomeType: "Layer Bonus",
        rankLevel: "Beginner",
        layer: "4",
        time: "2023-10-01 12:00",
    },
    {
        from: "78337",
        amount: "0.00003",
        incomeType: "Layer Bonus",
        rankLevel: "Beginner",
        layer: "1",
        time: "2023-10-01 12:00",
    },
    {
        from: "563546",
        amount: "0.000055",
        incomeType: "Layer Bonus",
        rankLevel: "Beginner",
        layer: "4",
        time: "2023-10-01 12:00",
    },
    {
        from: "78337",
        amount: "0.00003",
        incomeType: "Layer Bonus",
        rankLevel: "Beginner",
        layer: "1",
        time: "2023-10-01 12:00",
    },
    {
        from: "563546",
        amount: "0.000055",
        incomeType: "Layer Bonus",
        rankLevel: "Beginner",
        layer: "4",
        time: "2023-10-01 12:00",
    }
];
const RecentBonusTable = () => {
    return (
        <>
            <div className="overflow-auto w-full max-h-[400px] md:max-h-[500px] rounded-lg">
                <table className="table-fixed min-w-[600px] sm:min-w-[900px] w-full text-sm">
                    <thead className="sticky top-0 z-10 bg-green-500 text-black">
                        <tr className="bg-green-500 text-black font-bold text-center">
                            <th className="w-40 px-4 py-2">From</th>
                            <th className="w-40 px-4 py-2">Amount</th>
                            <th className="w-40 px-4 py-2">Income Type</th>
                            <th className="w-40 px-4 py-2">Rank Level</th>
                            <th className="w-40 px-4 py-2">Layer</th>
                            <th className="w-40 px-4 py-2">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map((employee, index) => (
                            <tr key={index} className="text-center text-white bg-neutral-800 odd:bg-neutral-900">
                                <td className="p-4">{employee?.from}</td>
                                <td className="p-4 text-green-500">
                                    {employee?.amount} <span className="font-semibold">{DEFAULT_CURRENCY}</span>
                                </td>
                                <td className="p-4">{employee?.incomeType}</td>
                                <td className="p-4">{employee?.rankLevel}</td>
                                <td className="p-4">{employee?.layer}</td>
                                <td className="p-4">{employee?.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default RecentBonusTable