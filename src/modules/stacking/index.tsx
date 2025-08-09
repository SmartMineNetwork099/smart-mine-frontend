import React from 'react'
// import WalletDataComponent from '@/components/WalletData'
import CollectCoins from '@/modules/stacking/CollectCoins'
import ReferralLink from '@/modules/stacking/ReferralLink'
import RecentBonus from '@/modules/stacking/RecentBonus'
const index = () => {
    return (
        <>
            {/* <WalletDataComponent /> */}
            <CollectCoins />
            <ReferralLink />
            <RecentBonus />
        </>
    )
}

export default index