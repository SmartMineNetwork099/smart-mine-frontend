'use client';
import React from 'react';
interface TabProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const tabs = [
    { label: 'Dashboard', link: 'dashboard' },
    { label: 'My Team', link: 'myTeam' },
    { label: 'Community Tree', link: 'communityTree' },
    { label: 'Community Info', link: 'communityInfo' },
    { label: 'Royalty & Rewards', link: 'royaltyAndRewards' },
];

const Tab: React.FC<TabProps> = ({ activeTab, onTabChange }) => {
    return (
        <div className="flex gap-4 mb-4">
            {tabs.map((tab) => (
                <button
                    key={tab?.link}
                    onClick={() => onTabChange(tab?.link)}
                    className={`px-8 py-3 rounded-lg font-semibold text-lg transition 
                        ${activeTab === tab?.link
                            ? 'bg-yellow-400 text-black shadow-md'
                            : 'bg-white text-gray-800 hover:bg-gray-100'
                        }`}
                >
                    {tab?.label}
                </button>
            ))}
        </div>
    );
};

export default Tab;
