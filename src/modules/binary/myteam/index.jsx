"use client"
import React, { useState } from 'react'
import Pagination from '@/components/Pagination'
const employees = [
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
    from: "875487",
    amount: "0.00003",
    incomeType: "Layer Bonus",
    rankLevel: "Beginner",
    layer: "1",
    time: "2023-10-01 12:00",
  },
  {
    from: "68527",
    amount: "0.00001",
    incomeType: "Layer Bonus",
    rankLevel: "Beginner",
    layer: "1",
    time: "2023-10-01 12:00",
  },
  {
    from: "875487",
    amount: "0.00003",
    incomeType: "Layer Bonus",
    rankLevel: "Beginner",
    layer: "1",
    time: "2023-10-01 12:00",
  },
];
const index = () => {
  const [page, setPage] = useState(1);

  return (
    <>
        <div className='h-screen p-4'>
          <div className=''>
            <Pagination currentPage={page} totalPages={20} onPageChange={setPage} />
          </div>
          <div className="overflow-auto w-full max-h-[400px] md:max-h-[500px] rounded-lg mt-4">
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
                {employees?.map((employee, index) => (
                  <tr key={index} className="text-center text-white bg-gray-600">
                    <td className="px-4 py-2">{employee.from}</td>
                    <td className="px-4 py-2">
                      {employee.amount} <span className="text-yellow-400 font-semibold">ST</span>
                    </td>
                    <td className="px-4 py-2">{employee.incomeType}</td>
                    <td className="px-4 py-2">{employee.rankLevel}</td>
                    <td className="px-4 py-2">{employee.layer}</td>
                    <td className="px-4 py-2">{employee.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
    </>
  )
}

export default index