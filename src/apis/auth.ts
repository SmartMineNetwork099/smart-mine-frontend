import { AxiosError } from "axios";
import api from "./axios.js"


// ✅ Get Nonce
export const getNonceApi = async (walletAddress: string, ref: string | null = null) => {
    try {
        const res = await api.post<{ nonce: string }>(`/api/auth/nonce`, {
            walletAddress, ref
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
) => {
    try {
        const res = await api.post<{ accessToken: string, message: string , userId:string , walletAddress:string}>(`/api/auth/verify`, {
            walletAddress,
            signature,
        } );
        return { data: res?.data, error: null };
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }
};
///////////////////////////////////////////////////////////////
export const silentLogin = async (walletAddress: string) =>{
     if (typeof window === "undefined") return;
      if (!window.ethereum) {
    console.error("❌ Wallet provider not found");
    return;
  }
    if (!walletAddress) {
      return { success: false, message: "Wallet address is required for login." };
    }
  // 1. get nonce
  const { data } = await api.post(`/api/auth/nonce`,{ walletAddress });

  // 2. sign message
  const message = `Login with wallet. Nonce: ${data.nonce}`;

  const signature = await window.ethereum.request({
    method: "personal_sign",
    params: [message, walletAddress],
  });

  // 3. verify
  const res = await api.post(
    `/api/auth/verify`,
    { walletAddress, signature },
  );

  // 4. save token
  localStorage.setItem(`accessToken_${walletAddress}`,res.data.accessToken);
  localStorage.setItem("activeWallet", walletAddress);
  return { success: true };
}
export const logout = async () =>{

  try {
        const res = await api.post(`/api/auth/logout`, {} );
        console.log(res, 'logoutresresres')
        return { data:null, message: res?.data?.message || null };
    } catch (err) {
        const error = err as AxiosError<{ message: string }>;
        return { data: null, error: error.response?.data?.message ?? "error try again." };
    }

}

