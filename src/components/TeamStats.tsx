'use client';
import Card from '@/components/Card';
import React from 'react';
import { LiaUsersSolid } from 'react-icons/lia';
import { RiTeamLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import ROUTES from '@/constants/routes';

const TeamStats = ({ data }) => {
    const router = useRouter();
    const teamStatsData: {
        name: string;
        number?: number;
        type: string;
        icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    }[] = [
            { name: 'Direct Referrals',type:"direct", number: data?.directTeam || 0, icon: RiTeamLine },
            { name: 'My Community size', type:"community", number: data?.communitySize || 0, icon: LiaUsersSolid },
        ];
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {teamStatsData?.map((item, index) => {
                    const Icon = item.icon;

                    const value = item?.number ?? '0';
                    const valueColorClass = Number(value) <= 0 ? 'text-red-500' : 'text-green-500';
                    const handleCardClick = (item:any) => {
                        console.log(item , 'iitteemm')
                        if(item?.type === 'community'){
                            router.push(ROUTES?.STACKING?.COMMUNITY)
                        }
                    }

                    return (
                        <Card
                            key={index}
                            onClick={() => handleCardClick(item)}
                            className="flex gap-2 items-center justify-between text-white px-3 sm:px-6 py-3"
                        >
                            <div>
                                <p className="font-semibold text-sm sm:text-base mb-1 text-gray-300">
                                    {item?.name}
                                </p>
                                <p className={`font-semibold text-sm ${valueColorClass}`}>
                                    {item?.number || 0}
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