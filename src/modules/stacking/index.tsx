import React from 'react'
// import WalletDataComponent from '@/components/WalletData'
import CollectCoins from '@/modules/stacking/CollectCoins'
import ReferralLink from '@/modules/stacking/ReferralLink'
import YourCommunity from '@/modules/stacking/YourCommunity'
const index = () => {
    return (
        <>
            {/* <WalletDataComponent /> */}
            <CollectCoins />
            <ReferralLink />
            <YourCommunity />
        </>
    )
}

export default index