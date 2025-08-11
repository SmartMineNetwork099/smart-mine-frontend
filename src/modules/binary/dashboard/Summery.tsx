'use client';
import Card from '@/components/Card';
import React from 'react';
import { IoGiftOutline } from 'react-icons/io5';
import { LiaUsersSolid } from 'react-icons/lia';
import { PiHandDeposit } from 'react-icons/pi';
import { RiTeamLine } from 'react-icons/ri';

const summeryData: {
    name: string;
    price?: string;
    number?: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}[] = [
    { name: 'Total Bonus', price: '0.001234', icon: IoGiftOutline },
    { name: 'Total Deposit', price: '1.753849', icon: PiHandDeposit },
    { name: 'Direct Referrals', number: '0', icon: RiTeamLine },
    { name: 'My Community size', number: '234', icon: LiaUsersSolid },
    { name: 'Direct Bonus', price: '2.001234', icon: IoGiftOutline },
    { name: 'Referral Bonus', price: '9.345683', icon: IoGiftOutline },
    { name: 'Upgrade Bonus', price: '3.001234', icon: IoGiftOutline },
    { name: 'Level Bonus', price: '0.0000', icon: IoGiftOutline },
    { name: 'Royalty Bonus', price: '10', icon: IoGiftOutline },
    { name: 'Reward Bonus', price: '44.231234', icon: IoGiftOutline },
];

const Summery = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {summeryData.map((item, index) => {
                const Icon = item.icon;

                const value = item.price ?? item.number ?? '0';
                const numericValue = parseFloat(value);
                const valueColorClass =
                    numericValue <= 0 ? 'text-red-500' : 'text-green-500';

                return (
                    <Card
                        key={index}
                        className="flex gap-2 items-center justify-between text-white px-3 sm:px-6 py-3"
                    >
                        <div>
                            <p className="font-semibold text-sm sm:text-base mb-1 text-yellow-400">
                                {item.name}
                            </p>
                            <p className={`font-semibold text-sm ${valueColorClass}`}>
                                {item?.price && (
                                    <>
                                        {item.price}{' '}
                                        <span className="text-yellow-400">ST</span>
                                    </>
                                )}
                                {item?.number && <>{item?.number}</>}
                            </p>
                        </div>
                        <div>
                            <Icon className="text-2xl" />
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};

export default Summery;
