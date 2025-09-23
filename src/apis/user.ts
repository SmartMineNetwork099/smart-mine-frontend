import axios, { AxiosError } from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE as string;

export interface Wallet {
    balance: number;
    miningEarnings: number;
    referralEarnings: number;
}

export interface User {
    _id: string;
    walletAddress: string;
    nonce: string;
    referredBy: string | null;
    referralLink: string;
    image_url: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    wallet: Wallet;
}


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
export const updateUserImage = async (
    userID: string,
    imageUrl: string,
) => {
    try {
        const res = await axios.post<{ token: string, message: string, image_url: string }>(`${API}/api/auth/update-image`, {
            userID,
            imageUrl,
        });
        console.log(res, 'resresres')
        if (res.status !== 200) {
            return { data: null, error: "Failed to update image. Please try again." };
        }
        return { data: res?.data, error: null };
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};
export const getUserData = async (
    id: string,
) => {
    try {
        const res = await axios.get<any>(`${API}/api/auth/getUserByID/${id}`);
        console.log(res, 'resresres1111')
        if (res.status !== 200) {
            return { data: null, error: "Failed to fetch user data. Please try again." };
        }
        return { data: res?.data, error: null };
    }
    catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};

export const getTeamStats = async (walletAddress: string) => {
    try {
        // Send walletAddress in the body
        const res = await axios.post(`${API}/api/auth/getTeamStats`, {
            walletAddress,
        });

        console.log(res.data, "getTeamStats response");

        if (res.status !== 200) {
            return {
                data: null,
                error: "Failed to fetch team stats. Please try again.",
            };
        }

        // Directly return only needed data
        return {
            data: res.data.data, // contains { directTeam, communitySize }
            error: null,
        };
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return {
            data: null,
            error: error.response?.data?.message ?? "Something went wrong. Try again.",
        };
    }
};

