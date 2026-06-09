import { AxiosError } from "axios";
import api from "./axios"

export const getSettingsApi = async () => {
    try {
        const res = await api.get<any>(`/api/settings/getSettings`);
        console.log(res, 'resresres11111232getSettingsgetSettings')
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
export const updateSettingsApi = async ( payload: any) => {
    try {
       
        const res = await api.patch<any>(`/api/settings/updateSettings`,
            payload
        );
        console.log(res, 'resresresupdateSettingsupdateSettings')
        return { data: res?.data, error: null };
    }
    catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};