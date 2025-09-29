'use client';
import Card from '@/components/Card';
import React from 'react';
import { LiaUsersSolid } from 'react-icons/lia';
import { RiTeamLine } from 'react-icons/ri';

const TeamStats = ({ data }) => {
    const teamStatsData: {
        name: string;
        number?: string;
        icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    }[] = [
            { name: 'Direct Referrals', number: data?.directTeam || 0, icon: RiTeamLine },
            { name: 'My Community size', number: data?.communitySize || 0, icon: LiaUsersSolid },
        ];
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {teamStatsData?.map((item, index) => {
                    const Icon = item.icon;

                    const value = item.number ?? '0';
                    const numericValue = parseFloat(value);
                    const valueColorClass =
                        numericValue <= 0 ? 'text-red-500' : 'text-green-500';

                    return (
                        <Card
                            key={index}
                            className="flex gap-2 items-center justify-between text-white px-3 sm:px-6 py-3"
                        >
                            <div>
                                <p className="font-semibold text-sm sm:text-base mb-1 text-gray-300">
                                    {item?.name}
                                </p>
                                <p className={`font-semibold text-sm ${valueColorClass}`}>
                                    {item?.number && <>{item?.number}</>}
                                </p>
                            </div>
                            <div>
                                <Icon className="text-4xl" />
                            </div>
                        </Card>
                    );
                })}
            </div>
        </>
    )
}

export default TeamStats