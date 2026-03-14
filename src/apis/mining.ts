import { AxiosError } from "axios";
import api from "./axios"

export const MiningTimeApi = async () => {
    try {
        const res = await api.get(`/api/stacking/mining-time` );
        return { data: res?.data, error: null };
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};
export const calculateMiningBonusAndFeeApi = async () => {
    try {
        const res = await api.get(`/api/stacking/calculateMiningBonusAndFee` );
        return { data: res?.data, error: null };
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};
export const startMiningApi = async (payload:any) => {
    try {
        const res = await api.post(`/api/stacking/mining-start`,  payload );
        return { data: res?.data, error: null };
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};