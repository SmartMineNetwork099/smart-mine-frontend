import  { AxiosError } from "axios";
import api from "./axios.js"

export const withdrawIncomeApi = async (payload:any) => {
    try {
        const res = await api.post<any>(`/api/wallet/withdraw-income`,payload,);
        console.log(res, 'withdrawApiwithdrawApiwithdrawApi')
        if(res?.data?.success){
        return { data: res?.data , error: null };
        }else{
            return { data: null, error: "error try again." };
        }
    }
    catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};
export const shareIncomeApi = async (payload:any) => {
    try {
        const res = await api.post<any>(`/api/wallet/share-income`,payload,);
        console.log(res, 'shareIncomeApishareIncomeApishareIncomeApi')
        if(res?.data?.success){
        return { data: res?.data , error: null };
        }else{
            return { data: null, error: "error try again." };
        }
    }
    catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};

export const getFreezeFeeQuote = async () => {
    try {
        const res = await api.post<any>(`/api/wallet/getFreezeFeeQuote`,);
        console.log(res, 'getCurrentBnbPriceApigetCurrentBnbPriceApi')
        if(res?.data?.success){
        return { data: res?.data , error: null };
        }else{
            return { data: null, error: "error try again." };
        }
    }
    catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};
export const verifyFreezeFeePaymentApi = async (payload:any) => {
    try {
        const res = await api.post<any>(`/api/wallet/verifyFreezeFeePayment`,payload);
        console.log(res, 'getCurrentBnbPriceApigetCurrentBnbPriceApi')
        if(res?.data?.success){
        return { data: res?.data , error: null };
        }else{
            return { data: null, error: "error try again." };
        }
    }
    catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};