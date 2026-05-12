'use client';
import React from 'react';
import TeamStats from '@/components/TeamStats';

const Summery = () => {
    const summeryData = {
        directTeam: 0,
        communitySize: 0
    }
    return (
        <>
            <TeamStats data={summeryData} />
        </>
    );
};

export default Summery;
