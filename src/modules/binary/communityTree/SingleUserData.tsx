'use client'
import { DEFAULT_CURRENCY } from '@/constants/currency';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { formatDate, normalizeWalletAddress } from '@/utils/func';
import HashLoader from '@/components/HashLoader';
import { getUserByIDAndPosition } from '@/apis/binaryApis';
import { useWalletAddress } from '@/hooks/useWallet';


const SingleUserData = ({id }) => {
    const nodeID = id ;
    console.log(id,'ididididididiididididid')
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
   
    console.log(id, 'singleuserdataaaaaaa1111') 
    let walletAddress = useWalletAddress();
    walletAddress = normalizeWalletAddress(walletAddress)
    const getUserInfo = async()=>{
        if(!walletAddress) return;
    setLoading(true)
     const data = await getUserByIDAndPosition(walletAddress ,nodeID );
    //  const data = await getUserData(walletAddress);
     console.log(data, 'singleuserdataaaaaaa21edsew32')
     if(data?.data){
     setUserData(data?.data || null)
     }
     if(data?.error){
        toast.error(data?.error)
        return
     }
        setLoading(false)
    }
    useEffect(() => {
    if (id && walletAddress) getUserInfo();
  }, [id, walletAddress]); 
   console.log(userData, 'userDatauserDatauserDatauserDatauserData')
    const walletInfo = [
    {
        name: 'ID',
        transactions: userData?.nodeID || 'N/A',
    },
    {
        name: 'Position',
        transactions: userData?.base36NodeId || 'N/A',
    },
    {
        name: 'Rank',
        transactions: userData?.planName || 'N/A',
    },
   {
      name: 'Activation Date',
      transactions: formatDate(userData?.createdAt) ||  'N/A',
    },
    {
        name: 'Referred By',
        transactions: userData?.referredBy || 'N/A',
    },
    {
        name: 'Community Size',
        transactions: String(userData?.belowTotalNodes) || '0',
    },

];
    return (
        <>
        {
            loading || !walletAddress ? <div className='flex items-center justify-center'><HashLoader/></div>
             :
            <div className='flex flex-col gap-4'>
                {walletInfo?.map((item: { name: string; transactions: any }, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className='w-1/3 sm:w-5/12 '>
                            <p className="font-medium p-1 text-white text-[11px] sm:text-base">
                                {item?.name}
                            </p>
                        </div>
                        <div className="w-2/3 sm:w-7/12 text-left">
                            <p className="font-medium text-green-500 bg-black rounded-lg py-1 px-2 sm:px-4 text-[12px] sm:text-base">
                                {item?.transactions.includes(DEFAULT_CURRENCY) ? (
                                    <>
                                        {item?.transactions.replace(DEFAULT_CURRENCY, '')}{' '}
                                        <span className="font-semibold">{DEFAULT_CURRENCY}</span>
                                    </>
                                ) : (
                                    item?.transactions
                                )}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        }
        </>
    )
}

export default SingleUserData