import axios, { AxiosError } from "axios";
const API = process.env.NEXT_PUBLIC_API_BASE as string;

export const getBinaryTree = async (userId:any) => {
    try {
        const res = await axios.get<any>(`${API}/api/binary/tree/${userId}`);
        console.log(res, 'resresrestreeeeeee')
        return { data: res?.data, error: null };
    }
    catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};



///////////////////////////////////////
export const getBinaryMyIds = async ({userId , currentLevel ,paginationCurrentPage }:any) => {
    console.log(userId , currentLevel , 'userIdplanLeveluserIdplanLevelgetBinaryMyIds')
    try {
        const res = await axios.post<any>(`${API}/api/binary/getBinaryMyIds`,{
            userId , currentLevel , paginationCurrentPage
        },
    {
    headers: {
      "Content-Type": "application/json",
    },
  });
        console.log(res, 'resresres11111232getBinaryMyIdsgetBinaryMyIdsgetBinaryMyIds')
        if(res?.data?.success){
        return { data: res?.data , error: null };
        }else{
            return { data: null, error:res?.data?.message || "error try again." };
        }
    }
    catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};
export const getUserByIDAndPosition = async (walletAddress : any , nodeID :any) => {
    console.log(walletAddress , nodeID , 'userIdplanLeveluserIdplanLevelgetBinaryMyIds')
    try {
        const res = await axios.post<any>(`${API}/api/binary/getUserByIDAndPosition`,{
            walletAddress , nodeID 
        },
    {
    headers: {
      "Content-Type": "application/json",
    },
  });
        console.log(res, 'resresres11111232getBinaryMyIdsgetBinaryMyIdsgetBinaryMyIds')
        if(res?.data?.success){
        return { data: res?.data?.data , error: null };
        }else{
            return { data: null, error:res?.data?.message || "error try again." };
        }
    }
    catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};
