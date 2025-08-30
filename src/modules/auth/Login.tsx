"use client";
import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { EthereumProvider } from "@walletconnect/ethereum-provider";

const API = process.env.NEXT_PUBLIC_API_BASE;
const WC_PROJECT_ID = "7eb8ecbd5aa37c35eabf3edda64d0a1e"; // apna WalletConnect projectId

// ✅ opBNB Mainnet Chain Info
const OPBNB_CHAIN_ID_HEX = "0xcc"; // 204 in hex
const OPBNB_CHAIN_ID_DEC = 204;

const Login = () => {
    const [address, setAddress] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [tokken, setTokken] = useState(null);

    const handleLogin = async () => {
        try {
            setLoading(true);
            setTokken(null);
            let provider: any, signer: any, walletAddress: string, type: string;

            // ✅ Step 1: Detect Wallet Type (PC Extension vs Mobile SafePal)
            if ((window as any).ethereum) {
                // Browser Extension (MetaMask / SafePal PC)
                await (window as any).ethereum.request({ method: "eth_requestAccounts" });
                provider = new ethers.BrowserProvider((window as any).ethereum);
                signer = await provider.getSigner();
                walletAddress = await signer.getAddress();
                type = "extension";
            } else {
                // Mobile SafePal via WalletConnect
                const wcProvider = await EthereumProvider.init({
                    projectId: WC_PROJECT_ID,
                    chains: [OPBNB_CHAIN_ID_DEC], // ✅ opBNB only
                    showQrModal: true,
                });
                await wcProvider.enable();

                provider = new ethers.BrowserProvider(wcProvider as any);
                signer = await provider.getSigner();
                walletAddress = await signer.getAddress();
                type = "walletconnect";
            }

            console.log("✅ Connected:", walletAddress, "via", type);
            setAddress(walletAddress);

            // ✅ Step 2: Check Network (must be opBNB Mainnet)
            const chainIdHex = await provider.send("eth_chainId", []);
            console.log("Chain ID (hex):", chainIdHex);

            const chainId = parseInt(chainIdHex, 16);
            console.log("Connected Chain:", chainId);

            if (chainId !== OPBNB_CHAIN_ID_DEC) {
                try {
                    // Try switching
                    await provider.send("wallet_switchEthereumChain", [
                        { chainId: OPBNB_CHAIN_ID_HEX },
                    ]);
                    console.log("✅ Switched to opBNB");
                } catch (switchError: any) {
                    // If chain is not added → add it
                    if (switchError.code === 4902) {
                        try {
                            await provider.send("wallet_addEthereumChain", [
                                {
                                    chainId: OPBNB_CHAIN_ID_HEX,
                                    chainName: "opBNB Mainnet",
                                    rpcUrls: ["https://opbnb-mainnet-rpc.bnbchain.org"],
                                    nativeCurrency: {
                                        name: "BNB",
                                        symbol: "BNB",
                                        decimals: 18,
                                    },
                                    blockExplorerUrls: ["https://mainnet.opbnbscan.com"],
                                },
                            ]);
                            console.log("✅ opBNB added & switched");
                        } catch (addError) {
                            alert("❌ Please manually switch your wallet to opBNB Mainnet (204)");
                            return;
                        }
                    } else {
                        alert("❌ Please manually switch your wallet to opBNB Mainnet (204)");
                        return;
                    }
                }
            }

            // ✅ Step 3: Get nonce from backend
            const nonceRes = await axios.get(`${API}/api/auth/nonce`, {
                params: { walletAddress },
            });
            const nonce = nonceRes?.data?.nonce;
            if (!nonce) throw new Error("Failed to get nonce");

            // ✅ Step 4: User signs message
            const message = `Login with wallet. Nonce: ${nonce}`;
            const signature = await signer.signMessage(message);

            // ✅ Step 5: Verify & receive JWT token
            const verifyRes = await fetch(`${API}/api/auth/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ walletAddress, signature, nonce }),
            });
            const data = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(data.error || "Verify failed");

            // ✅ Step 6: Save token
            localStorage.setItem("token", data.token);
            setTokken(data.token);
            alert("✅ Login successful! Token saved.");

            // router.push("/dashboard"); // if needed
        } catch (err: any) {
            console.error("❌ Login error:", err);
            alert(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md border rounded-2xl p-6 shadow text-black">
                <h1 className="text-2xl font-semibold mb-2">Login with Wallet</h1>
                <p className="text-sm opacity-80 mb-6">
                    Click the button below to connect your wallet and sign a login
                    message. (opBNB only)
                </p>
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full rounded-xl px-4 py-3 bg-black text-white disabled:opacity-60"
                >
                    {loading ? "Connecting..." : "Connect Wallet & Login"}
                </button>
                {address && (
                    <>
                        <p className="mt-4 text-sm break-all">Connected: {address}</p>
                        <p className="mt-4 text-sm break-all">Tokken: {tokken}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
