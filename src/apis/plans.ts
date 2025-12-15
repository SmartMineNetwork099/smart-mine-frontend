import axios, { AxiosError } from "axios";
const API = process.env.NEXT_PUBLIC_API_BASE as string;

export const getPlans = async (walletAddress:any) => {
    try {
        const res = await axios.get<any>(`${API}/api/binary/plans/getAllPlans/${walletAddress}`);
        console.log(res, 'resresres11111232getAllPlansgetAllPlans')
        if(res?.data?.success){
        return { data: res?.data?.plans , error: null };
        }else{
            return { data: null, error: "error try again." };
        }
    }
    catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};
export const buyPlans = async (walletAddress: any, planId: any) => {
    try {
        const token = typeof window !== "undefined" ? localStorage.getItem(`token_${walletAddress}`) : null;
        if (!token) {
            return { data: null, error: "User is not authenticated." };
        }
        const res = await axios.post<any>(`${API}/api/binary/plans/buy/${walletAddress}`,
            planId,
            { headers: { Authorization: `Bearer ${token}` } }

        );
        console.log(res, 'resresres987667fdfd')
        return { data: res?.data, error: null };
    }
    catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};