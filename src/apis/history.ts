import  { AxiosError } from "axios";
import api from "./axios"

export const getUserTransactionsApi = async ({type , paginationCurrentPage}) => {
    try {
        const res = await api.post<any>(`/api/transaction/getUserTransactions`,{
type,paginationCurrentPage
        },);
        console.log(res, 'getUserTransactionsApigetUserTransactionsApigetUserTransactionsApi')
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