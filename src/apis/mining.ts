import axios, { AxiosError } from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE as string;

export const startMiningApi = async (userId: string | null) => {
    try {
        const miningTime = new Date().toISOString();
        const res = await axios.post(`${API}/api/mining/mining-start`, { userId, amount: 1.0, miningTime });
        return { data: res?.data, error: null };
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};