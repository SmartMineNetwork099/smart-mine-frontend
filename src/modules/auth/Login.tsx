"use client";
import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { EthereumProvider } from "@walletconnect/ethereum-provider";

const API = process.env.NEXT_PUBLIC_API_BASE as string;
const WC_PROJECT_ID = "7eb8ecbd5aa37c35eabf3edda64d0a1e"; // apna WalletConnect projectId

// ✅ opBNB Mainnet Chain Info
const OPBNB_CHAIN_ID_HEX = "0xcc"; // 204 in hex
const OPBNB_CHAIN_ID_DEC = 204;

type WalletType = "extension" | "walletconnect";

const Login: React.FC = () => {
    const [address, setAddress] = useState<string>("");
    const [type, setType] = useState<WalletType | "">("");
    const [loading, setLoading] = useState<boolean>(false);
    const [tokken, setTokken] = useState<string | null>(null);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [walletSignature, setWalletSignature] = useState<string | null>(null);
    const [chainID, setChainID] = useState<string | null>(null);

    const handleLogin = async () => {
        try {
            setLoading(true);
            setTokken(null);

            let provider: ethers.BrowserProvider | null = null;
            let signer: ethers.Signer | null = null;
            let walletAddress = "";
            let type: WalletType;

            // ✅ Step 1: Detect Wallet Type (PC Extension vs Mobile SafePal)
            if ((window as Window & { ethereum?: { isSafePal?: boolean; request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum) {
                const ethProvider = (window as Window & { ethereum?: { isSafePal?: boolean; request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum!;
                console.log("Detected Ethereum provider:", ethProvider.isSafePal);

                // ❌ Reject MetaMask / Other extensions
                if (!ethProvider.isSafePal) {
                    alert("❌ Only SafePal wallet is allowed. Please use SafePal.");
                    return;
                }

                // ✅ SafePal Extension
                await ethProvider.request({ method: "eth_requestAccounts" });
                provider = new ethers.BrowserProvider(ethProvider as unknown as ethers.Eip1193Provider);
                signer = await provider.getSigner();
                walletAddress = await signer.getAddress();
                type = "extension";
                setType(type);
            } else {
                // ✅ Mobile SafePal via WalletConnect
                const wcProvider = await EthereumProvider.init({
                    projectId: WC_PROJECT_ID,
                    chains: [OPBNB_CHAIN_ID_DEC], // ✅ opBNB only
                    showQrModal: true,
                });
                await wcProvider.enable();

                // ❌ Check if wallet is SafePal (session metadata)
                const session = wcProvider.session;
                const walletName: string = session?.peer?.metadata?.name ?? "";
                console.log("Connected Wallet via WC:", walletName);

                if (!walletName.toLowerCase().includes("safepal")) {
                    alert("❌ Only SafePal Wallet is allowed via WalletConnect.");
                    return;
                }

                provider = new ethers.BrowserProvider(wcProvider as unknown as ethers.Eip1193Provider);
                signer = await provider.getSigner();
                walletAddress = await signer.getAddress();
                type = "walletconnect";
                setType(type);
            }

            console.log("✅ Connected:", walletAddress, "via", type);
            setAddress(walletAddress);

            // ✅ Step 2: Check Network (must be opBNB Mainnet)
            const chainIdHex = await provider!.send("eth_chainId", []) as string;
            const chainId = parseInt(chainIdHex, 16);
            setChainID(chainId.toString());

            if (chainId !== OPBNB_CHAIN_ID_DEC) {
                try {
                    await provider!.send("wallet_switchEthereumChain", [
                        { chainId: OPBNB_CHAIN_ID_HEX },
                    ]);
                } catch (err: unknown) {
                    if ((err as { code?: number }).code === 4902) {
                        await provider!.send("wallet_addEthereumChain", [
                            {
                                chainId: OPBNB_CHAIN_ID_HEX,
                                chainName: "opBNB Mainnet",
                                rpcUrls: ["https://opbnb-mainnet-rpc.bnbchain.org"],
                                nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
                                blockExplorerUrls: ["https://mainnet.opbnbscan.com"],
                            },
                        ]);
                    } else {
                        alert("❌ Please switch your wallet to opBNB (204).");
                        return;
                    }
                }
            }

            // ✅ Step 3: Get nonce from backend
            const nonceRes = await axios.get<{ nonce: string }>(
                `${API}/api/auth/nonce`,
                { params: { walletAddress } }
            );

            setWalletAddress(walletAddress);
            const nonce = nonceRes?.data?.nonce;
            if (!nonce) throw new Error("Failed to get nonce");

            // ✅ Step 4: User signs message
            const message = `Login with wallet. Nonce: ${nonce}`;
            const signature = await signer!.signMessage(message);
            setWalletSignature(signature);

            // ✅ Step 5: Verify
            const verifyRes = await fetch(`${API}/api/auth/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ walletAddress, signature, nonce }),
            });
            const data: { token?: string; error?: string } = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(data.error || "Verify failed");

            // ✅ Step 6: Save token
            if (data.token) {
                localStorage.setItem("token", data.token);
                setTokken(data.token);
                alert("✅ Login successful! Token saved.");
            }
        } catch (err: unknown) {
            console.error("❌ Login error:", err);
            alert(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md border rounded-2xl p-6 shadow text-black">
                <h1 className="text-2xl font-semibold mb-2">Login with Wallet</h1>
                <p className="text-sm opacity-80 mb-6">
                    Only SafePal wallet is supported (Extension + Mobile via WalletConnect).
                </p>
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full rounded-xl px-4 py-3 bg-black text-white disabled:opacity-60"
                >
                    {loading ? "Connecting..." : "Connect SafePal & Login"}
                </button>

                {address && (
                    <>
                        <p className="mt-4 text-sm break-all">Connected: {address}</p>
                        <p className="mt-4 text-sm break-all">Type: {type}</p>
                        <p className="mt-4 text-sm break-all">ChainID: {chainID}</p>
                        <p className="mt-4 text-sm break-all">Token: {tokken}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;
