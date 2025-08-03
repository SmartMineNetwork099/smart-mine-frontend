'use client';
import React from 'react';
import { IoGiftOutline } from 'react-icons/io5';
import { LiaUsersSolid } from 'react-icons/lia';
import { PiHandDeposit } from 'react-icons/pi';
import { RiTeamLine } from 'react-icons/ri';
import { Text } from 'rizzui';

const summeryData: {
    name: string;
    price: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}[] = [
        {
            name: 'Total Bonus',
            price: '0.001234 ST',
            icon: IoGiftOutline,
        },
        {
            name: 'Total Deposit',
            price: '1.753849 ST',
            icon: PiHandDeposit,
        },
        {
            name: 'Direct Referrals',
            price: '21',
            icon: RiTeamLine,
        },
        {
            name: 'My Community size',
            price: '234',
            icon: LiaUsersSolid,
        },
        {
            name: 'Direct Bonus',
            price: '2.001234 ST',
            icon: IoGiftOutline,
        },
        {
            name: 'Referral Bonus',
            price: '9.345683 ST',
            icon: IoGiftOutline,
        },
        {
            name: 'Upgrade Bonus',
            price: '3.001234 ST',
            icon: IoGiftOutline,
        },
        {
            name: 'Level Bonus',
            price: '1.111234 ST',
            icon: IoGiftOutline,
        },
        {
            name: 'Royalty Bonus',
            price: '10 ST',
            icon: IoGiftOutline,
        },
        {
            name: 'Reward Bonus',
            price: '44.231234 ST',
            icon: IoGiftOutline,
        },
    ];

const Summery = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {summeryData.map(
                (
                    item: {
                        name: string;
                        price: string;
                        icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
                    },
                    index: number
                ) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={index}
                            className="flex gap-2 items-center justify-between text-white rounded-lg px-3 sm:px-6 py-3 bg-gray-600"
                        >
                            <div>
                                <Text className="font-semibold text-sm sm:text-base mb-1 text-yellow-400">
                                    {item.name}
                                </Text>
                                <Text className="font-semibold text-sm">
                                    {item.price.includes('ST') ? (
                                        <>
                                            {item.price.replace(' ST', '')}{' '}
                                            <span className="text-yellow-400">ST</span>
                                        </>
                                    ) : (
                                        item.price
                                    )}
                                </Text>
                            </div>
                            <div>
                                <Icon className="text-2xl" />
                            </div>
                        </div>
                    );
                }
            )}
        </div>
    );
};

export default Summery;
