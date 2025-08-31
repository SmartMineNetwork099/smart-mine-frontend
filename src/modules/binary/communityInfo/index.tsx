"use client"
import React, { useState } from 'react'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table';
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
};

const employees: Employee[] = [
    { from: "78337", amount: "0.00003", incomeType: "Layer Bonus", rankLevel: "Beginner", layer: "1", time: "2023-10-01 12:00" },
    { from: "563546", amount: "0.000055", incomeType: "Layer Bonus", rankLevel: "Beginner", layer: "4", time: "2023-10-01 12:00" },
    { from: "78337", amount: "0.00003", incomeType: "Layer Bonus", rankLevel: "Beginner", layer: "1", time: "2023-10-01 12:00" },
    { from: "875487", amount: "0.00003", incomeType: "Layer Bonus", rankLevel: "Beginner", layer: "1", time: "2023-10-01 12:00" },
    { from: "68527", amount: "0.00001", incomeType: "Layer Bonus", rankLevel: "Beginner", layer: "1", time: "2023-10-01 12:00" },
    { from: "875487", amount: "0.00003", incomeType: "Layer Bonus", rankLevel: "Beginner", layer: "1", time: "2023-10-01 12:00" },
];

const columns: Column<Employee>[] = [
    { key: "from", label: "From" },
    { key: "amount", label: "Amount" },
    { key: "incomeType", label: "Income Type" },
    { key: "rankLevel", label: "Rank Level" },
    { key: "layer", label: "Layer" },
    { key: "time", label: "Time" },
];
const Index = () => {
  const [page, setPage] = useState(1);

  return (
    <>
      <div className='h-screen p-4'>
        <div className='flex items-center justify-start md:justify-center overflow-x-auto scrollbar-hidden mb-2'>
          <Pagination currentPage={page} totalPages={15} onPageChange={setPage} />
        </div>
        <Table data={employees} columns={columns}/>

      </div>
    </>
  )
}

export default Index