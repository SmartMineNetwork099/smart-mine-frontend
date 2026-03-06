import  { AxiosError } from "axios";
import api from "./axios.js"

export const getUserTransactionsApi = async () => {
    try {
        const res = await api.get<any>(`/api/transaction/getUserTransactions`,);
        console.log(res, 'getUserTransactionsApigetUserTransactionsApigetUserTransactionsApi')
        if(res?.data?.success){
        return { data: res?.data?.userTransactions , error: null };
        }else{
            return { data: null, error: "error try again." };
        }
    }
    catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};