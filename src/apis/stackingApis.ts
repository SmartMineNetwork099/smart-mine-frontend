import  { AxiosError } from "axios";
import api from "./axios"

export const getUserStackingPlans = async () => {
    try {
        const res = await api.post<any>(`/api/stacking/getUserStackingPlans`,{});
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
export const buyStackingPlans = async ({ planId , feeTxHash ,walletAddress , paymentSource}:any) => {
    try {
        const res = await api.post<any>(`/api/stacking/buyStackingPlan`,{
             planId , feeTxHash ,walletAddress ,paymentSource
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
export const collectBonusApi = async () => {
    try {
        const res = await api.post<any>(`/api/stacking/collectBonus`,{});
        console.log(res, 'resresres11111232')
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
