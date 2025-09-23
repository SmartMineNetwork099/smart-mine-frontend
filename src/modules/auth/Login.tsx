'use client';
import React, { useState, Suspense } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getNonceApi, verifySignatureApi } from "@/apis/auth";
import { connectWallet, checkAndSwitchNetwork, getUserIdFromWallet } from "@/utils/walletHelpers";
import ROUTES from "@/constants/routes";
import { useSearchParams } from "next/navigation";

const LoginContent: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const ref = searchParams.get("ref");
    console.log("refffffffffff", ref);
    const userID = getUserIdFromWallet();
    const handleLogin = async () => {
        try {
            setLoading(true);

            // ✅ Step 1: Connect Wallet
            const wallet = await connectWallet();
            if (!wallet) return;

            // ✅ Step 2: Check Network
            const isCorrectNetwork = await checkAndSwitchNetwork(wallet.provider);
            if (!isCorrectNetwork) return;

            // ✅ Step 3: Get nonce
            const nonceRes = await getNonceApi(wallet.address, ref);
            if (nonceRes?.error) {
                toast.error(nonceRes?.error);
                return;
            }
            const nonce = nonceRes?.data?.nonce as string;

            // ✅ Step 4: Sign message
            const message = `Login with wallet. Nonce: ${nonce}`;
            const signature = await wallet.signer.signMessage(message);

            // ✅ Step 5: Verify
            const verifyRes = await verifySignatureApi(wallet.address, signature, nonce);
            if (verifyRes?.error) {
                toast.error(verifyRes?.error);
                return;
            }
            console.log("verifyRes", verifyRes);
            // ✅ Step 6: Save token
            if (verifyRes?.data) {
                localStorage.setItem(`userID`, verifyRes.data.userID);
                localStorage.setItem(`token_${userID}`, verifyRes.data.token);
                localStorage.setItem(`walletData_${userID}`, JSON.stringify(verifyRes?.data));
                router.replace(ROUTES?.STACKING?.DASHBOARD);
                toast.success(verifyRes?.data?.message);
            }
        } catch (err) {
            console.error("Login failed:", err);
            toast.error("❌ Login failed");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="bg-gradient-to-b h-[95vh] from-[#0f0c29] via-[#302b63] to-[#24243e] flex flex-col">
            <div className="flex flex-1 items-center justify-center p-4">
                <div className="w-full max-w-md bg-white border rounded-2xl p-8 shadow-lg text-black">
                    <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">Login with Wallet</h1>
                    <p className="text-xs sm:text-sm opacity-80 mb-6 text-center">
                        Only SafePal wallet is supported (Extension + WalletConnect) and select network opBNB.
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
