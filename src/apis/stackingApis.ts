import { getUserWalletAddress } from "@/utils/walletHelpers";
import axios, { AxiosError } from "axios";
const API = process.env.NEXT_PUBLIC_API_BASE as string;

export const getAllStackingPlansWithTeamData = async (userId:any , walletAddress:any) => {
    try {
        const res = await axios.post<any>(`${API}/api/stacking/getAllStackingPlansWithTeamData`,{
            userId , walletAddress
        });
        console.log(res, 'resresres11111232getAllStackingPlansgetAllStackingPlans')
        if(res?.data?.success){
        return { data: res?.data?.data , error: null };
        }else{
            return { data: null, error: "error try again." };
        }
    }
    catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};
export const buyStackingPlans = async ({userId , planId , feeTxHash ,walletAddress}:any) => {
    try {
        const res = await axios.post<any>(`${API}/api/stacking/buyStackingPlan`,{
            userId , planId , feeTxHash ,walletAddress
        });
        console.log(res, 'resresres11111232buyStackingPlansbuyStackingPlans')
        if(res?.data?.success){
        return { data: res?.data , error: null };
        }else{
            return { data: null, error:res?.data?.message || "error try again." };
        }
    }
    catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};
