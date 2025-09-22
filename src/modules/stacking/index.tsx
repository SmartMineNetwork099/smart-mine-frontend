import React from 'react'
// import WalletDataComponent from '@/components/WalletData'
import CollectCoins from '@/modules/stacking/CollectCoins'
import ReferralLink from '@/modules/stacking/ReferralLink'
import YourCommunity from '@/modules/stacking/YourCommunity'
import NetworkOverview from '@/modules/stacking/NetworkOverview'
const index = () => {
    return (
        <>
            {/* <WalletDataComponent /> */}
            <CollectCoins />
            <ReferralLink />
            <NetworkOverview />
            <YourCommunity />
        </>
    )
}

export default index