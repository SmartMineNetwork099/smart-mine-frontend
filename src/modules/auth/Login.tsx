'use client';
import React, { useState, Suspense } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getNonceApi, verifySignatureApi } from "@/apis/auth";
import { connectWallet, checkAndSwitchNetwork } from "@/utils/walletHelpers";
import ROUTES from "@/constants/routes";
import { useSearchParams } from "next/navigation";
import Messages from "@/constants/messages";
import { normalizeWalletAddress } from "@/utils/func";
import { upsertUserData } from "@/db/saveData";

const LoginContent: React.FC = () => {   
    const [loading, setLoading] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useState<any>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const ref = searchParams.get("ref");
    console.log("refffffffffff", ref);
  const handleLogin = async () => {
    try {
        setLoading(true);

        const wallet = await connectWallet();
        console.log("wallet:", wallet);
        if (!wallet) return;

        const isCorrectNetwork = await checkAndSwitchNetwork(wallet.provider);
        console.log("isCorrectNetwork:", isCorrectNetwork);
        if (!isCorrectNetwork) return;

        const nonceRes = await getNonceApi(wallet.address, ref);
        console.log("nonceRes:", nonceRes);

        if (nonceRes?.error) {
            toast.error(nonceRes?.error);
            return;
        }

        const nonce = nonceRes?.data?.nonce as string;
        const message = `Login_with_wallet_Nonce_${nonce}`;
        console.log(message,'messagemessagemessagemessagemessage')
        const signature = await wallet.signer.signMessage(message);
        console.log(signature,'signaturesignaturesignaturesignature')

        const verifyRes = await verifySignatureApi(wallet.address, signature);
        console.log("verifyRes:", verifyRes);

        if (verifyRes?.error) {
            toast.error(verifyRes?.error);
            return;
        }

        if (verifyRes?.data) {
            const userID = verifyRes.data.userId;
            const walletAddress = verifyRes?.data?.walletAddress;
            const normalizedWalletAddress = normalizeWalletAddress(walletAddress) || '';
            const accessToken = verifyRes.data.accessToken;

            console.log("userID:", userID);
            console.log("normalizedWalletAddress:", normalizedWalletAddress);
            console.log("accessToken:", accessToken);

            if (!accessToken) {
               toast.error("Access token missing");
               return;
               }
            localStorage.setItem(`walletAddress`, normalizedWalletAddress);
            localStorage.setItem(`activeWallet`, normalizedWalletAddress);

            console.log("before upsertUserData");
             const cookieRes = await fetch("/api/set-auth-cookie", {
             method: "POST",
             headers: {
            "Content-Type": "application/json",
             },
            body: JSON.stringify({ accessToken }),
             });

             const text = await cookieRes.text();
             console.log("cookie raw response:", text);

             let cookieData:any = null;
             try {
                cookieData = text ? JSON.parse(text) : null;
                } catch (error) {
                 console.error("Invalid JSON response:", text);
                }
            console.log("cookieData:", cookieData);

           if (!cookieRes.ok) {
            toast.error(cookieData?.message || "Failed to set auth cookie");
             return;
             }
            console.log("before upsertUserData");
            await upsertUserData(normalizedWalletAddress, verifyRes?.data);
            console.log("after upsertUserData");

            console.log("before redirect");
            toast.success(verifyRes?.data?.message);
            // window.location.href = `${ROUTES?.STACKING?.DASHBOARD}?userId=${userID}`;
            // return;

            console.log("before router.replace");
            router.replace(`${ROUTES?.STACKING?.DASHBOARD}?userId=${userID}`);
            console.log("after router.replace");

        } else {
            console.log("verifyRes.data missing");
        }
    } catch (err) {
        console.error("Login failed:", err);
        toast.error(Messages?.FAILED_MESSAGE("❌ Login"));
    } finally {
        setLoading(false);
    }
};


    return (
        <div className="bg-gradient-to-b h-[95vh] flex flex-col">
            <div className="flex flex-1 items-center justify-center p-4">
                <div className="w-full max-w-md bg-white/10 backdrop-blur-sm border-2 border-green-500 rounded-2xl p-8 shadow-lg text-white">
                    <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center text-green-500">Login with Wallet</h1>
                    <p className="text-xs sm:text-sm opacity-80 mb-6 text-center">
                        Only SafePal wallet is supported (Extension + WalletConnect) and <span className="text-green-500 font-bold"> select network opBNB </span> 
                    </p>
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full rounded-xl px-4 py-3 bg-black text-white text-xs sm:text-base font-semibold disabled:opacity-60"
                    >
                        {loading ? "Connecting..." : "Connect SafePal & Login"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Login: React.FC = () => (
    <Suspense>
        <LoginContent />
    </Suspense>
);

export default Login;
