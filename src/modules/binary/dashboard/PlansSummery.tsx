import React, { useEffect, useState } from 'react'
import PlansCarousel from '@/components/PlansCarousel';
import Card from '@/components/Card';
import PlansTable from '@/components/tables/PlansTable';
import { toast } from 'react-toastify';
import { getPlans } from '@/apis/plans';
import { getUserIdFromWallet } from '@/utils/walletHelpers';
const PlansSummery = () => {
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    // ✅ useEffect for fetching + resize
    useEffect(() => {
        getAllPlans();
    }, []);

    // ✅ Move getAllPlans above useEffect for clarity
    const getAllPlans = async () => {
        setLoading(true);
        try {
            const id = getUserIdFromWallet()
            const { data, error } = await getPlans(id);
            console.log(data, 'data1234567plansplans')

            if (error) {
                setPlans([]);
                toast.error(error);
            } else {
                setPlans(data || []);
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong fetching plans.");
            setPlans([]);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            {/* <Card className='mt-8'>
                <div className=''>
                    <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white'>Choose <span className='text-green-500'>Plans</span></p>
                </div>
                <PlansCarousel plans={plans} loading={loading}/>
            </Card> */}



            <Card className='mt-8'>
                <div className=''>
                    <p className='font-semibold sm:font-bold text-xl sm:text-3xl text-white mb-4'>View <span className='text-green-500'>Plans</span></p>
                </div>
                <PlansTable plans={plans} loading={loading}/>
            </Card>


        </>
    )
}

export default PlansSummery