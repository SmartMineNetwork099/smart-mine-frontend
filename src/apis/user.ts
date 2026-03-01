import  { AxiosError } from "axios";
import api from "./axios.js"
export interface Wallet {
    balance: number;
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
    paginationCurrentPage: number,
) => {
    try {
        const res = await api.post<any>(`/api/auth/referrals-level`, {
            walletAddress,
            level,
            paginationCurrentPage,
        });
        return { data: res?.data, error: null };
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};
export const updateUserImage = async (
    walletAddress: string,
    imageUrl: string,
) => {
    try {
        const res = await api.post<{ accessToken_: string, message: string, image_url: string }>(`/api/auth/update-image`, {
            walletAddress,
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
export const getUserDataApi = async (
    walletAddress: string,
) => {
    try {
        const res = await api.get<any>(`/api/auth/getUserByWalletAddress/${walletAddress}`);
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
        const res = await api.post(`/api/stacking/getTeamStats`, {
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