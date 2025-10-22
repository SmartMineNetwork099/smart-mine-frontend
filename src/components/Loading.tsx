import React from 'react'
import dynamic from "next/dynamic";

const HashLoader = dynamic(() => import("react-spinners/HashLoader"), {
  ssr: false,
});

const Loading = () => {
    return (
        <>
            <HashLoader color='#25d50e' size={40}/>
        </>
    )
}

export default Loading