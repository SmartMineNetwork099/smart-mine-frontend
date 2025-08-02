import React from 'react'
import { SiBinance } from 'react-icons/si';
import { AiOutlineWarning } from 'react-icons/ai';
import { IoGiftOutline } from 'react-icons/io5';

const TotalLostBalance = () => {
    return (
        <div className="flex items-center justify-between rounded-2xl p-6 w-full mx-auto border-2 border-red-400 bg-gradient-to-r from-[#ff512f] to-[#f9d423] relative shadow-lg animate-pulse-opacity mt-4">
            <div className="flex flex-col gap-2 z-10">
                <div className="flex items-center gap-2">
                    <AiOutlineWarning className="text-yellow-400 text-2xl" />
                    <span className="text-white font-bold text-sm sm:text-xl">Total Lost Bonus</span>
                </div>
                <div className="text-yellow-400 font-extrabold text-md sm:text-3xl mt-2">0.0008227 <span>ST</span></div>
                <div className="text-white font-semibold text-sm sm:text-lg mt-2">Act now to stop losing bonus!</div>
            </div>
            <div className="flex-1 flex justify-end items-center">
                <span>
                    <IoGiftOutline className="bg-black rounded-full text-7xl p-3 text-yellow-400" />
                </span>
            </div>
            <style jsx>{`
        @keyframes pulse-opacity {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .animate-pulse-opacity {
          animation: pulse-opacity 2s infinite;
        }
      `}</style>
        </div>
    )
}

export default TotalLostBalance