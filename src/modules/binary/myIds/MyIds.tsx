// 'use client'
// import React, { useEffect, useState } from 'react'
// import BinaryMyIdsTable from '@/components/tables/BinaryMyIdsTable';
// import Pagination from '@/components/Pagination';
// import { getBinaryMyIds } from '@/apis/binaryApis';
// import { useWalletAddress } from '@/hooks/useWallet';
// import { normalizeWalletAddress } from '@/utils/func';
// // import { toast } from 'react-toastify';


// const MyIds = () => {
//     const [tableData, setTableData] = useState<any>([]);
//     const [totalNumberOfNodes, setTotalNumberOfNodes] = useState<number>(0);
//     const [page, setPage] = useState(1);
//     const [paginationCurrentPage, setPaginationCurrentPage] = useState <any>(1);
//     const [totalPaginationPages , setTotalPaginationPages ] = useState(1);
//     const [totalNumberOfNodesAtCurrentLevel , setTotalNumberOfNodesAtCurrentLevel ] = useState(1);
//     const [loading, setLoading] = useState<boolean>(true);
//      let walletAddress = useWalletAddress();
//         walletAddress = normalizeWalletAddress(walletAddress)
    

//     const getLevelData = async () => {
//         if (!walletAddress) return;
//         try {
//             setLoading(true);
//             console.log("pagepagepagepage", page);

//             const response = await getBinaryMyIds({ walletAddress, currentLevel: page , paginationCurrentPage});
//             setTableData(Array.isArray(response?.data?.nodes) ? response?.data?.nodes : []);
//             setTotalNumberOfNodes(response?.data?.totalNumberOfNodes || 0);
//             setTotalPaginationPages(response?.data?.totalPages)
//             setTotalNumberOfNodesAtCurrentLevel(response?.data?.totalNumberOfNodesAtCurrentLevel || 0);
//             console.log(response?.data?.nodes, "referrals__data");
//         } catch (error) {
//             console.error("Error fetching referrals:", error);
//         } finally {
//             setLoading(false);
//         }
//     }

//     useEffect(() => {
//         if (walletAddress) {
//             getLevelData();
//         }
//     }, [walletAddress, page,paginationCurrentPage]);


//     return (
//         <div className='p-4'>
//             <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white mb-4'>
//                 My <span className='text-green-500'>IDS <span className='font-black'>({totalNumberOfNodes || 0})</span></span>
//             </p>
//             <div className='my-2'>
//                 <Pagination currentPage={page} onPageChange={setPage} pages={10}/>
//             </div>
//             <BinaryMyIdsTable data={tableData} loading={loading} currentPage={page} totalPaginationPages ={totalPaginationPages } paginationCurrentPage={paginationCurrentPage} setPaginationCurrentPage={setPaginationCurrentPage} totalNumberOfNodesAtCurrentLevel={totalNumberOfNodesAtCurrentLevel}/>
//         </div>
//     );
// }

// export default MyIds;