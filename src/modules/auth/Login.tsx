'use client';
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { getNonceApi, verifySignatureApi } from "@/apis/auth";
import { connectWallet, checkAndSwitchNetwork } from "@/utils/walletHelpers";
import ROUTES from "@/constants/routes";

const Login: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

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
            const nonceRes = await getNonceApi(wallet.address);
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

            // ✅ Step 6: Save token
            if (verifyRes?.data) {
                localStorage.setItem("token", verifyRes.data.token);
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
        <div className="flex items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-md border rounded-2xl p-6 shadow text-black">
                <h1 className="text-2xl font-semibold mb-2">Login with Wallet</h1>
                <p className="text-sm opacity-80 mb-6">
                    Only SafePal wallet is supported (Extension + WalletConnect) and select network opBNB.
                </p>
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full rounded-xl px-4 py-3 bg-black text-white disabled:opacity-60"
                >
                    {loading ? "Connecting..." : "Connect SafePal & Login"}
                </button>
            </div>
        </div>
    );
};

export default Login;
