import axios, { AxiosError } from "axios";
const API = process.env.NEXT_PUBLIC_API_BASE as string;

export const getPlans = async () => {
    try {
        const res = await axios.get<any>(`${API}/api/binary/plans/getAllPlans`);
        console.log(res, 'resresres11111232')
        return { data: res?.data, error: null };
    }
    catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};
export const buyPlans = async (userId: any, plansToBuy: any) => {
    try {
        const token = typeof window !== "undefined" ? localStorage.getItem(`token_${userId}`) : null;
        if (!token) {
            return { data: null, error: "User is not authenticated." };
        }
        const res = await axios.post<any>(`${API}/api/binary/plans/buy/${userId}`,
            {plansToBuy},
            { headers: { Authorization: `Bearer ${token}` } }

        );
        console.log(res, 'resresres987667')
        return { data: res?.data, error: null };
    }
    catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};