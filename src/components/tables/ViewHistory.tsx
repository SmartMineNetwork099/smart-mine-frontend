import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import HashLoader from 'react-spinners/HashLoader';
import Pagination2 from "@/components/Pagination2";


const ViewHistoryTable = ({data=[] ,  loading=true , type='myIncome' , totalPaginationPages=1 , paginationCurrentPage=1 , setPaginationCurrentPage}) => {
        const [responsiveColspan, setResponsiveColspan] = useState(2)

         // Handle Responsive 
    useEffect(() => {
        const handleResize = () => {
            setResponsiveColspan(window.innerWidth <= 640 ? 5 : 5);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    
    console.log(data,'datatata')
    console.log(type,'typetypetype')
    const formatDate = (date:any) => {
  return new Date(date).toLocaleDateString("en-GB");
};
const shortId = (id:any) => {
if (!id) return "";
return id.slice(-6);
};
const pageSize = 20; // Assuming 20 items per page
 
    return (
        <>
            <div className="overflow-auto w-full max-h-[400px] md:max-h-[500px] rounded-lg scrollbar-hidden">
                <table className="table-fixed min-w-[600px] sm:min-w-[900px] w-full text-sm">
                    <thead className="sticky top-0 z-10 bg-green-500 text-black">
                        <tr className="bg-green-500 text-black font-bold text-center">
                            <th className="w-[70px] sm:w-[100px] px-4 py-2 border">Sn.</th>
                            {
                            type === 'withdraw' &&  
                            <th className="w-[70px] sm:w-[100px] px-4 py-2 border">To</th>
                            }
                            <th className="w-[70px] sm:w-[100px] px-4 py-2 border">Amount</th>
                            <th className="w-[70px] sm:w-[100px] px-4 py-2 border">Action</th>
                            {
                             type === 'myIncome' &&  
                            <th className="w-[70px] sm:w-[100px] px-4 py-2 border">Source</th>
                            }
                            <th className="w-[70px] sm:w-[100px] px-4 py-2 border">Note</th>
                            <th className="w-[70px] sm:w-[100px] px-4 py-2 border">Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                       loading ? (
                        <tr>
                            <td colSpan={responsiveColspan} className="!text-center py-6">
                                <div className="flex justify-center items-center">
                                    <HashLoader color="#22c55e"/>
                                </div>
                            </td>
                        </tr>
                    ) : data && data.length > 0 ? (
                         data?.map((his:any, index:number) => (
                            <tr key={index} className="text-center text-white bg-neutral-700/5 odd:bg-neutral-700/70">
                                <td className="p-4">
                                    {(paginationCurrentPage - 1) * pageSize + index + 1}
                                    </td>

                                {
                                type === 'withdraw' &&  
                                <td className="p-4">{shortId(his?.to)|| '------'}</td>
                                }
                                <td className="p-4">{his?.amount} $</td>
                                <td className={`p-4 ${his?.action==='debit' ? 'text-red-500' : 'text-green-500'}`}>{his?.action}</td>
                                {
                                type === 'myIncome' &&  
                                <td className="p-4">{his?.paymentSource|| '------'}</td>
                                }
                                <td className="p-4">{his?.note || '------'}</td>
                                <td className="p-4">{formatDate(his?.createdAt)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={responsiveColspan} className="text-center py-6">
                                <Image
                                    src="/undraw_no_data_found.svg"
                                    className="mx-auto w-28 sm:w-40 h-28 sm:h-40"
                                    alt="No data found image"
                                    width={160}
                                    height={160}
                                />
                                <p className="text-white mt-2 font-bold">No Data Found</p>
                            </td>
                        </tr>
                    )

                      }
                    </tbody>
                </table>
            </div>


                  {/* PAGINATION */}
      {totalPaginationPages > 1 && !loading && (
        <Pagination2
          currentPage={paginationCurrentPage}
          totalPages={totalPaginationPages}
          onPageChange={setPaginationCurrentPage}
        />
      )}
        </>
    )
}

export default ViewHistoryTable