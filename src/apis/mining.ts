import axios, { AxiosError } from "axios";
const API = process.env.NEXT_PUBLIC_API_BASE as string;

export const MiningTimeApi = async () => {
    try {
        const res = await axios.get(`${API}/api/stacking/mining-time` );
        return { data: res?.data, error: null };
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};
export const startMiningApi = async (payload:any) => {
    try {
        const res = await axios.post(`${API}/api/stacking/mining-start`,  payload );
        return { data: res?.data, error: null };
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};