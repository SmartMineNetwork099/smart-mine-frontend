'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'rizzui';


const tabs = [
    { label: 'Dashboard', link: 'dashboard' },
    { label: 'My Team', link: 'myTeam' },
    { label: 'Community Tree', link: 'communityTree' },
    { label: 'Community Info', link: 'communityInfo' },
    { label: 'Royalty & Rewards', link: 'royaltyAndRewards' },
];

const Tab = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const router = useRouter();

    const handleTabClick = (link: string) => {
        setActiveTab(link);
        router.push(`/${link}`);
    };
    return (
        <div className="flex items-center justify-start lg:justify-center gap-4 overflow-x-auto px-2">
            {tabs?.map((tab) => (
                <Button
                    key={tab?.link}
                    onClick={() => handleTabClick(tab?.link)}
                    className={`min-w-36 sm:min-w-44 py-3 rounded-lg font-semibold text-xs sm:text-sm transition text-black
                        ${activeTab === tab?.link
                            ? 'bg-yellow-300'
                            : 'bg-white'
                        }`}
                >
                    {tab?.label}
                </Button>
            ))}
        </div>
    );
};

export default Tab;
