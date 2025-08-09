'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Text } from 'rizzui';
import { IconType } from "react-icons";

// 1️⃣ Define a type for each tab item
interface TabItem {
    label: string;
    link?: string;
    icon?: IconType;
}

// 2️⃣ Define the props type
interface TabProps {
    tabs: TabItem[];
    style?: string;
    heading?: string;
}

const Tab: React.FC<TabProps> = ({ tabs, style, heading }) => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const router = useRouter();

    const handleTabClick = (link?: string) => {
        if (!link) return;
        setActiveTab(link);
        router.push(`/${link}`);
    };
    return (
        <>
            {
                heading &&
                <Text className='text-xl font-bold text-green-500 mb-2'>{heading}</Text>
            }
            <div className="flex items-center justify-start lg:justify-center gap-2 sm:gap-4 overflow-x-auto scrollbar-hidden">
                {tabs?.map((tab) => (
                    <Button
                        key={tab?.label}
                        onClick={() => handleTabClick(tab?.link)}
                        className={`${style} flex items-center gap-1 sm:gap-2 py-3 rounded-lg font-semibold text-xs sm:text-sm transition text-black cursor-pointer
                        ${activeTab === tab?.link
                                ? 'bg-yellow-300'
                                : 'bg-white'
                            }`}
                    >
                        {tab?.label}
                        {tab?.icon && <tab.icon className='text-sm sm:text-xl '/>}
                    </Button>
                ))}
            </div>
        </>
    );
};

export default Tab;
