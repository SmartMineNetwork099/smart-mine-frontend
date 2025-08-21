"use client"
import React, { useState } from 'react'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table';

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
        <div className='flex items-center justify-start md:justify-center overflow-x-auto scrollbar-hidden'>
          <Pagination currentPage={page} totalPages={15} onPageChange={setPage} />
        </div>
        <Table data={employees} />

      </div>
    </>
  )
}

export default index