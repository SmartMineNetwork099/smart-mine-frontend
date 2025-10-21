"use client"
import React, { Suspense } from 'react'
import CollectCoins from '@/modules/stacking/CollectCoins'
import ReferralLink from '@/modules/stacking/ReferralLink'
import YourCommunity from '@/modules/stacking/YourCommunity'
import NetworkOverview from '@/modules/stacking/NetworkOverview'
import WalletActions from '@/components/WalletActions'
const index = () => {
    return (
        <>
         <Suspense fallback={<p className="text-white hidden">Loading...</p>}>
         <div className='mb-4'>
            <WalletActions />
         </div>
            <CollectCoins />
            <ReferralLink />
            <NetworkOverview />
            <YourCommunity />
            </Suspense>
        </>
    )
}

export default index