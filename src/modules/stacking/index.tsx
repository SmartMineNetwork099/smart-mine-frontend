"use client"
import React, { Suspense } from 'react'
// import WalletDataComponent from '@/components/WalletData'
import CollectCoins from '@/modules/stacking/CollectCoins'
import ReferralLink from '@/modules/stacking/ReferralLink'
import YourCommunity from '@/modules/stacking/YourCommunity'
import NetworkOverview from '@/modules/stacking/NetworkOverview'
const index = () => {
    return (
        <>
         <Suspense fallback={<p className="text-white hidden">Loading...</p>}>
            {/* <WalletDataComponent /> */}
            <CollectCoins />
            <ReferralLink />
            <NetworkOverview />
            <YourCommunity />
            </Suspense>
        </>
    )
}

export default index