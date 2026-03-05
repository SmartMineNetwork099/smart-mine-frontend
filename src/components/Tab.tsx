'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'rizzui';
import { IconType } from "react-icons";

// 1️⃣ Define a type for each tab item
interface TabItem {
    label: string;
    link?: string;
    icon?: IconType;
    value?:string;
}

// 2️⃣ Define the props type
interface TabProps {
    tabs: TabItem[];
    style?: string;
    heading?: string;
    defaultTab?:string
    onTabChange?: (name: string) => void;
}

const Tab: React.FC<TabProps> = ({ tabs, style, heading,defaultTab, onTabChange }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);

const handleTabClick = (name: string) => {
    setActiveTab(name);

    if (onTabChange) {
        onTabChange(name);
    }
};
    return (
        <>
            {
                heading &&
                <p className='text-xl font-bold text-green-500 mb-2'>{heading}</p>
            }
            <div className="flex items-center justify-start md:justify-center gap-1 sm:gap-4 overflow-x-auto scrollbar-hidden">
                {tabs?.map((tab) => (
                    <Button
                        key={tab?.label}
                        onClick={() => handleTabClick(tab?.value||'')}
                        className={`${style} flex items-center justify-center gap-0.5 sm:gap-2 py-3 rounded-lg font-semibold text-[10px] sm:text-sm transition text-black cursor-pointer border-0
                        ${activeTab === tab?.value
                                ? 'bg-green-500'
                                : 'bg-neutral-800 text-white'
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
