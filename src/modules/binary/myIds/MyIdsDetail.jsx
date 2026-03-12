// import React, { useEffect, useState } from 'react'
// import BinaryMyIdsDetailTable from '@/components/tables/BinaryMyIdsDetailTable';
// import { getNodesByPositionAndLevel } from '@/apis/binaryApis';
// import { toast } from 'react-toastify';
// import Pagination from '@/components/Pagination';
// const MyIdsDetail = ({userID , nodeID , position}) => {
//     const [loading, setLoading] = useState(false);
//     const [page, setPage] = useState(1);
//     const [tableData, setTableData] = useState([]);
//     const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
//     const [totalPaginationPages , setTotalPaginationPages ] = useState(1);
//     const [totalNumberOfNodesAtCurrentLevel , setTotalNumberOfNodesAtCurrentLevel ] = useState(1);

//     console.log("userIDnodeIDuserIDnodeIDuserIDnodeIDssw", userID , nodeID);
//      const getUserInfo = async()=>{
//          setLoading(true)
//          const res = await getNodesByPositionAndLevel(page , position , paginationCurrentPage);
//          console.log(res, 'singleuserdataaaaaaa21edsew322321321')
//          if(res?.data){
//          setTableData(res?.data?.nodes || null)
//          setTotalPaginationPages(res?.data?.totalPages)
//          setTotalNumberOfNodesAtCurrentLevel(res?.data?.totalNumberOfNodesAtCurrentLevel || 0);

//          setLoading(false)
//          }
//          if(res?.error){
//             toast.error(res?.error)
//             setLoading(false)
//             return
//          }
//         }

//         useEffect(() => {
//             if(userID && nodeID) getUserInfo();
//       }, [page,paginationCurrentPage]); 
//   return (
//     <>
//       <div className='my-2'>
//         <Pagination currentPage={page} onPageChange={setPage} pages={10}/>
//       </div>
//     <BinaryMyIdsDetailTable data={tableData} loading={loading} totalPaginationPages={totalPaginationPages} paginationCurrentPage={paginationCurrentPage} setPaginationCurrentPage={setPaginationCurrentPage} totalNumberOfNodesAtCurrentLevel={totalNumberOfNodesAtCurrentLevel}/>
//     </>
//   )
// }

// export default MyIdsDetail