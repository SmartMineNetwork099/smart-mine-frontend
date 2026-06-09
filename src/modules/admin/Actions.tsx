'use client'
import { getSettingsApi, updateSettingsApi } from '@/apis/settings'
import Card from '@/components/Card'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import SpinnerLoader from "@/components/SpinnerLoader";


const Actions = () => {
  const [canBuyStackingPlans, setCanBuyStackingPlans] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [nextValue, setNextValue] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleToggle = () => {
    setNextValue(!canBuyStackingPlans)
    setShowConfirm(true)
  }

  const confirmToggle = async () => {
    setLoading(true);
    console.log(nextValue,'nextValuenextValuenextValue')
    const payload = {
      canBuyPlans: nextValue
    }
   const { data, error } = await updateSettingsApi(payload);
    if(error){
        toast.error(error);
        setShowConfirm(false);
        setLoading(false);
        return;
    }
    setCanBuyStackingPlans(data?.data?.canBuyPlans || false)
    toast.success(data?.message);
    setLoading(false);
    console.log(data, 'updateSettingsApiupdateSettingsApi')
    setShowConfirm(false)
  }

  const getSettings = async () => {
    setLoading(true);
    const {data , error} = await getSettingsApi();
    if(error){
        toast.error(error);
        setLoading(false);
        return;
    }
    console.log(data, 'getSettingsgetSettingsgetSettings')
    if(data?.success){
      setCanBuyStackingPlans(data?.data?.canBuyPlans || false)
    }
    setLoading(false);

}
    useEffect(() => {
        getSettings();
    }, [])

  return (
    <>
      <Card className='p-6'>
        <div className='space-y-4'>
          <div>
            <p className='text-xl font-semibold text-green-500'>Action Controlled by Admin</p>
            <p className='text-sm text-gray-400'>Use the switch to enable or disable whether users can buy stacking plans.</p>
          </div>

          <div className='flex flex-col gap-3 rounded-xl border border-white/10 bg-slate-900/80 p-4'>
            <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <p className='text-sm font-medium text-white'>Can users buy stacking plans</p>
                <p className='text-xs text-gray-400'>Toggle to allow or prevent users from purchasing stacking plans.</p>
              </div>

              <button
                type='button'
                onClick={handleToggle}
                className={`relative inline-flex h-9 w-16 items-center rounded-full border-2 transition-colors duration-200 ${canBuyStackingPlans ? 'border-emerald-500 bg-emerald-500' : 'border-slate-600 bg-slate-600'} ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                aria-pressed={canBuyStackingPlans}
                value={canBuyStackingPlans ? 'ON' : 'OFF'}
                disabled={loading}
              >
                <span className={`ml-0.5 inline-block h-7 w-7 rounded-full bg-white shadow transition-transform duration-200 ${canBuyStackingPlans ? 'translate-x-7' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className='text-sm'>
              Current status:&nbsp;
              <span className={canBuyStackingPlans ? 'text-emerald-400' : 'text-red-400'}>
                {canBuyStackingPlans ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {showConfirm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4'>
          <div className='w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl'>
            <h2 className='text-lg font-semibold text-white'>Confirm change</h2>
            <p className='mt-3 text-sm text-gray-300'>
              Are you sure you want to turn <span className='font-semibold text-white'>{nextValue ? 'ON' : 'OFF'}</span> the setting for buying stacking plans?
            </p>

            <div className='mt-6 flex justify-end gap-3'>
              <button
                disabled={loading}
                type='button'
                onClick={() => setShowConfirm(false)}
                className={`rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-white transition hover:bg-white/10 ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                Cancel
              </button>
              <button
                disabled={loading}
                type='button'
                onClick={confirmToggle}
                className={`flex gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
              >
                Confirm { loading && <SpinnerLoader /> }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Actions
