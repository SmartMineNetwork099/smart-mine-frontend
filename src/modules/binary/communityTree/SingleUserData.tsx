import { getUserData } from '@/apis/user';
import { DEFAULT_CURRENCY } from '@/constants/currency';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { formatDate, formatWalletAddress } from '@/utils/func';
import Loading from '@/components/Loading';


const SingleUserData = ({id}) => {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    console.log(id, 'singleuserdataaaaaaa1111')
    const getUserInfo = async()=>{
        setLoading(true)
     const data = await getUserData(id);
     console.log(data, 'singleuserdataaaaaaa')
     if(data?.data?.user){
     setUserData(data?.data?.user || null)
     }
     if(data?.error){
        toast.error(data?.error)
        return
     }
        setLoading(false)
    }
    useEffect(() => {
    if (id) getUserInfo();
  }, []); 
    const walletInfo = [
    {
        name: 'ID',
        transactions: userData?._id || 'N/A',
    },
    {
        name: 'Address',
        transactions: formatWalletAddress(userData?.walletAddress)|| 'N/A',
    },
    {
        name: 'Rank',
        transactions: '-----',
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
        transactions: '-----',
    },

];
    return (
        <>
        {
            loading ? <div className='flex items-center justify-center'><Loading/></div>
             :
            <div className='flex flex-col gap-4'>
                {walletInfo?.map((item: { name: string; transactions: string }, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                        <div className='w-2/5 sm:w-1/2'>
                            <p className="font-medium p-1 text-white text-[12px] sm:text-base">
                                {item?.name}
                            </p>
                        </div>
                        <div className="w-3/5 sm:w-1/2 text-left">
                            <p className="font-medium text-green-500 bg-black rounded-lg py-1 px-2 sm:px-4 text-[11px] sm:text-base inline sm:block">
                                {item.transactions.includes(DEFAULT_CURRENCY) ? (
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