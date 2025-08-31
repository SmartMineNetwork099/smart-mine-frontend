import axios, { AxiosError } from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE as string;

// ✅ Get Nonce
export const getNonceApi = async (walletAddress: string) => {
    try {
        const res = await axios.get<{ nonce: string }>(`${API}/api/auth/nonce`, {
            params: { walletAddress },
        });
        return { data: res?.data, error: null };
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};

// ✅ Verify Signature
export const verifySignatureApi = async (
    walletAddress: string,
    signature: string,
    nonce: string
) => {
    try {
        const res = await axios.post<{ token: string, message: string }>(`${API}/api/auth/verify`, {
            walletAddress,
            signature,
            nonce,
        });
        return { data: res?.data, error: null };
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};
