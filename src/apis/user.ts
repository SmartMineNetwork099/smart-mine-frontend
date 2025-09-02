import axios, { AxiosError } from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE as string;

export const getReferralsAtLevel = async (
    walletAddress: string,
    level: number,
) => {
    try {
        const res = await axios.post<{ token: string, message: string }>(`${API}/api/auth/referrals-level`, {
            walletAddress,
            level,
        });
        return { data: res?.data, error: null };
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};