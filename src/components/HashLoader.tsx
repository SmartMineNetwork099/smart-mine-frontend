import React from 'react'
import dynamic from "next/dynamic";

const DynamicHashLoader  = dynamic(() => import("react-spinners/HashLoader"), {
  ssr: false,
});

const HashLoader = () => {
    return (
        <>
            <DynamicHashLoader  color='#25d50e' size={40}/>
        </>
    )
}

export default HashLoader