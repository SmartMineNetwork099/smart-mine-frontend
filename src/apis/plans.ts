// import { AxiosError } from "axios";
// import api from "./axios.js"

// export const getPlans = async (walletAddress:any) => {
//     try {
//         const res = await api.get<any>(`/api/binary/plans/getAllPlans/${walletAddress}`);
//         console.log(res, 'resresres11111232getAllPlansgetAllPlans')
//         if(res?.data?.success){
//         return { data: res?.data?.plans , error: null };
//         }else{
//             return { data: null, error: "error try again." };
//         }
//     }
//     catch (err) {
//         const error = err as AxiosError<{ message: string }>;
//         return { data: null, error: error.response?.data?.message ?? "error try again." };
//     }
// };
// export const buyPlans = async (walletAddress: any, planId: any) => {
//     try {
//         const accessToken_ = typeof window !== "undefined" ? localStorage.getItem(`accessToken_${walletAddress}`) : null;
//         if (!accessToken_) {
//             return { data: null, error: "User is not authenticated." };
//         }
//         const res = await api.post<any>(`/api/binary/plans/buy/${walletAddress}`,
//             planId,
//             { headers: { Authorization: `Bearer ${accessToken_}` } }

//         );
//         console.log(res, 'resresres987667fdfd')
//         return { data: res?.data, error: null };
//     }
//     catch (err) {
//         const error = err as AxiosError<{ message: string }>;
//         return { data: null, error: error.response?.data?.message ?? "error try again." };
//     }
// };