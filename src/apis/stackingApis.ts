import axios, { AxiosError } from "axios";
const API = process.env.NEXT_PUBLIC_API_BASE as string;

export const getAllStackingPlans = async (userId:any) => {
    try {
        const res = await axios.post<any>(`${API}/api/stacking/getAllStackingPlans`,{
            userId
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