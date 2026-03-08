'use client'
import React, { useEffect, useState } from 'react'
import StakingTable from '@/components/tables/StakingTable';
import { getReferralsAtLevel } from '@/apis/user';
import Pagination from '@/components/Pagination';
import { useWalletAddress } from '@/hooks/useWallet';
import { IoMdArrowRoundBack } from 'react-icons/io';
import ROUTES from '@/constants/routes';
import { useRouter } from 'next/navigation';
import Pagination2 from "@/components/Pagination2";
import { normalizeWalletAddress } from '@/utils/func';

// import Messages from '@/constants/messages';
// import { toast } from 'react-toastify';


const YourCommunity = () => {
    const [tableData, setTableData] = useState<any>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalPaginationPages , setTotalPaginationPages ] = useState(1);
    const [paginationCurrentPage, setPaginationCurrentPage] = useState(1);
    const [totalNumberOfNodesAtCurrentLevel , setTotalNumberOfNodesAtCurrentLevel ] = useState(0);


     let walletAddress = useWalletAddress();
        walletAddress = normalizeWalletAddress(walletAddress)
    const router = useRouter();
    

    const getLevelData = async (LevelNumber: number = 1) => {
        if (!walletAddress) return;
        try {
            setLoading(true);
            const {data , error} = await getReferralsAtLevel(walletAddress, LevelNumber , paginationCurrentPage);
            if(error){
                console.error("API Error:", error);
                return;
            }
            setTableData(Array.isArray(data?.nodes) ? data?.nodes : []);
            setTotalPaginationPages(data?.totalPages || 1);
            setTotalNumberOfNodesAtCurrentLevel(data?.totalNumberOfNodesAtCurrentLevel || 0);
            setPaginationCurrentPage(data?.currentPage || 1); // Reset to first page whenever level changes
        } catch (error) {
            console.error("Error fetching referrals:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (walletAddress) {
            getLevelData(page);
        }
    }, [walletAddress , page , paginationCurrentPage]);

    
      const handleBack = () => {
    console.log('Back button clicked');
    router.push(ROUTES?.STACKING?.DASHBOARD)
  }

    return (
        <div className='p-4'>
            <div className='flex gap-2 items-center mb-4'>
            <IoMdArrowRoundBack className='cursor-pointer text-4xl' onClick={handleBack}/>
            <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white'>
                Your <span className='text-green-500'>Community</span>
            </p>
            </div>
            <div className='my-2'>
                <Pagination currentPage={page} onPageChange={setPage} pages={10}/>
            </div>
            <StakingTable data={tableData} loading={loading} paginationCurrentPage={paginationCurrentPage} totalNumberOfNodesAtCurrentLevel={totalNumberOfNodesAtCurrentLevel}/>
            <div>
                  {/* PAGINATION */}
      {totalPaginationPages > 1 && !loading && (
        <Pagination2
          currentPage={paginationCurrentPage}
          totalPages={totalPaginationPages}
          onPageChange={setPaginationCurrentPage}
        />
      )}
            </div>
        </div>
    );
}

export default YourCommunity;
