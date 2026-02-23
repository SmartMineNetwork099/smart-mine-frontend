import { ethers } from "ethers";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { toast } from "react-toastify";
import Messages from "@/constants/messages";
import { normalizeWalletAddress } from "./func";


// ✅ opBNB Mainnet Chain Info
export const OPBNB_CHAIN_ID_HEX = "0xcc"; // 204 in hex
export const OPBNB_CHAIN_ID_DEC = 204;

const WC_PROJECT_ID = "7eb8ecbd5aa37c35eabf3edda64d0a1e";

// ---------- Types ----------
export type WalletType = "extension" | "walletconnect";

export type WalletConnectResult = {
  provider: ethers.BrowserProvider;
  signer: ethers.Signer;
  address: string;
  type: WalletType;
};

// SafePal ka ethereum object type (extends EIP-1193)
export interface SafePalEthereumProvider extends ethers.Eip1193Provider {
  isSafePal?: boolean;
}

// ---------- Step 1: Detect Wallet ----------
export const connectWallet = async (): Promise<WalletConnectResult | null> => {
  try {
    let provider: ethers.BrowserProvider | null = null;
    let signer: ethers.Signer | null = null;
    let walletAddress = "";
    let type: WalletType;

    const ethProvider = (window as Window & { ethereum?: SafePalEthereumProvider }).ethereum;

    // ✅ SafePal Extension
    if (ethProvider) {
      if (!ethProvider.isSafePal) {
        toast.error(Messages?.ONLY_ALLOW_MESSAGE("❌ Only SafePal extension"));
        return null;
      }

      await ethProvider.request({ method: "eth_requestAccounts" });
      provider = new ethers.BrowserProvider(ethProvider);
      signer = await provider.getSigner();
      walletAddress = await signer.getAddress();
      type = "extension";
    } else {
      // ✅ SafePal via WalletConnect
      const wcProvider = await EthereumProvider.init({
        projectId: WC_PROJECT_ID,
        chains: [OPBNB_CHAIN_ID_DEC],
        showQrModal: true,
      });
      await wcProvider.enable();

      const session = wcProvider.session;
      const walletName: string = session?.peer?.metadata?.name ?? "";
      if (!walletName.toLowerCase().includes("safepal")) {
        toast.error(Messages?.ONLY_ALLOW_MESSAGE("❌ Only SafePal Wallet"));

        return null;
      }

      provider = new ethers.BrowserProvider(
        wcProvider as unknown as ethers.Eip1193Provider
      );
      signer = await provider.getSigner();
      walletAddress = await signer.getAddress();
      type = "walletconnect";
    }
    walletAddress = normalizeWalletAddress(walletAddress) || '';

    return { provider, signer, address: walletAddress, type };
  } catch (err: unknown) {
    console.error("Wallet connection failed:", err);
    toast.error(Messages?.SOME_THING_WRONG);
    return null;
  }
};

// ---------- Step 2: Check & Switch Network ----------
export const checkAndSwitchNetwork = async (
  provider: ethers.BrowserProvider
): Promise<boolean> => {
  try {
    const chainIdHex = (await provider.send("eth_chainId", [])) as string;
    const chainId = parseInt(chainIdHex, 16);

    if (chainId !== OPBNB_CHAIN_ID_DEC) {
      try {
        await provider.send("wallet_switchEthereumChain", [
          { chainId: OPBNB_CHAIN_ID_HEX },
        ]);
      } catch (err: unknown) {
        const e = err as { code?: number };
        if (e.code === 4902) {
          await provider.send("wallet_addEthereumChain", [
            {
              chainId: OPBNB_CHAIN_ID_HEX,
              chainName: "opBNB Mainnet",
              rpcUrls: ["https://opbnb-mainnet-rpc.bnbchain.org"],
              nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
              blockExplorerUrls: ["https://mainnet.opbnbscan.com"],
            },
          ]);
        } else {
          toast.error(Messages?.SWITCH_MESSAGE(" to opBNB network (204)."));
          return false;
        }
      }
    }
    return true;
  } catch (err: unknown) {
    console.error("Network check failed:", err);
    toast.error(Messages?.SOME_THING_WRONG);
    return false;
  }
};


//////////////////////////////////////////////////////////////////////////////////////////
// utils/walletHelpers.ts
// export const getUserIdFromWallet = (): string | null => {
//   try {
//     if (typeof window === "undefined") return null; // 🛡️ SSR Guard
//     // 1️⃣ Try from localStorage
//     const userID = localStorage.getItem("userID");

//     if (userID) {
//       const walletData = JSON.parse(localStorage.getItem(`walletData_${userID}`) || "{}");
//       return walletData?.userId || userID; // prefer walletData.userId but fallback to raw
//     }

//     // 2️⃣ If not in localStorage, fallback to URL param
//     const urlParams = new URLSearchParams(window.location.search);
//     const urlUserId = urlParams.get("userId");
//     console.log("urlUserId", urlUserId);
//     if (urlUserId) {
//       try {
//         localStorage.setItem("userID", urlUserId);
//       } catch (e) {
//         console.warn("Could not save userID to localStorage", e);
//       }
//       const walletData = JSON.parse(localStorage.getItem(`walletData_${urlUserId}`) || "{}");
//       return walletData?.userId || urlUserId;
//     }

//     return null;
//   } catch (error) {
//     console.error("getUserIdFromWallet error:", error);
//     return null;
//   }
// };


export const getUserWalletAddress = async() => {
  try {
     if (!window.ethereum) {
          return { success: false, message: "Wallet provider not found." };
        }
    
        // Initialize provider and signer
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
    
        // Get connected wallet address
        const userWalletAddress = await signer.getAddress();
        if(!userWalletAddress) {
          return { success: false, message: "Unable to get wallet address." };
        }
         return {
      success: true,
      userWalletAddress
    };
  } catch (error:any) {
     return {
      success: false,
      message: error.message || "Something went wrong"
  };
}
};

// export const getUserWalletAddress2 = (): string | null => {
//   try {
//     if (typeof window === "undefined") return null; // 🛡️ SSR Guard
//     // 1️⃣ Get userId first (use above function so fallback works automatically)
//     const userID = getUserIdFromWallet();
//     if (!userID) return null;

//     // 2️⃣ Read walletData from storage
//     const walletData = JSON.parse(localStorage.getItem(`walletData_${userID}`) || "{}");
//     return walletData?.walletAddress || null;
//   } catch (error) {
//     console.error("getUserWalletAddress error:", error);
//     return null;
//   }
// };