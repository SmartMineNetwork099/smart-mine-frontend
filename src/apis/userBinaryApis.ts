import { AxiosError } from "axios";
import api from "./axios"

export const getuserBinaryTree = async (payload:any) => {
    console.log(payload, 'payloadpayloadpayloadpayload')
  try {
    const res = await api.get<any>(`/api/userBinary/downline`);
    return { data: res?.data, error: null };
  } catch (err:any) {
    console.error('Error in getBinaryTree:', err);
    return { data: null, error: err.response?.data?.error ?? "Error, try again." };
  }
};







// export const getBinaryMyIds = async ({walletAddress , currentLevel ,paginationCurrentPage=1 }:any) => {
//     console.log(walletAddress , currentLevel , 'walletAddresswalletAddresswalletAddresscurrentLevelcurrentLevel')
//     try {
//         const res = await api.post<any>(`/api/binary/getBinaryMyIds`,{
//             walletAddress , currentLevel , paginationCurrentPage
//         },
//     {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//         console.log(res, 'resresres11111232getBinaryMyIdsgetBinaryMyIdsgetBinaryMyIds')
//         if(res?.data?.success){
//         return { data: res?.data , error: null };
//         }else{
//             return { data: null, error:res?.data?.message || "error try again." };
//         }
//     }
//     catch (err) {
//         const error = err as AxiosError<{ message: string }>;
//         return { data: null, error: error.response?.data?.message ?? "error try again." };
//     }
// };
// export const getUserByIDAndPosition = async (walletAddress : any , nodeID :any) => {
//     console.log(walletAddress , nodeID , 'userIdplanLeveluserIdplanLevelgetBinaryMyIds')
//     try {
//         const res = await api.post<any>(`/api/binary/getUserByIDAndPosition`,{
//             walletAddress , nodeID 
//         },
//     {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//         console.log(res, 'resresres11111232getBinaryMyIdsgetBinaryMyIdsgetBinaryMyIds')
//         if(res?.data?.success){
//         return { data: res?.data?.data , error: null };
//         }else{
//             return { data: null, error:res?.data?.message || "error try again." };
//         }
//     }
//     catch (err) {
//         const error = err as AxiosError<{ message: string }>;
//         return { data: null, error: error.response?.data?.message ?? "error try again." };
//     }
// };
// export const getNodesByPositionAndLevel = async (level:any , position:any , paginationCurrentPage:any =1) => {
//     console.log(level , 'userIdplanLeveluserIdplanLevelgetBinaryMyIds')
//     try {
//         const res = await api.post<any>(`/api/binary/getNodesByPositionAndLevel`,{
//             level , position , paginationCurrentPage
//         },
//     {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
//         console.log(res, 'resgetNodesByPositionAndLevelgetSubtreeCount')
//         if(res?.data?.success){
//         return { data: res?.data , error: null };
//         }else{
//             return { data: null, error:res?.data?.message || "error try again." };
//         }
//     }
//     catch (err) {
//         const error = err as AxiosError<{ message: string }>;
//         return { data: null, error: error.response?.data?.message ?? "error try again." };
//     }
// };
