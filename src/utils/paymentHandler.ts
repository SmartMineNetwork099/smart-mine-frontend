import Messages from "@/constants/messages";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { normalizeTxHash } from "@/utils/func";
type SendPlatformFeeArgs = {
  type: "mining" | "buy_stacking_plan";
  planBuyAmount?: string; // ✅ optional
};
const PLATFORM_FEE_BNB = process.env.NEXT_PUBLIC_PLATFORM_FEE_FOR_MINING || "0";
const CONFIRMATIONS = Number(
  process.env.NEXT_PUBLIC_MIN_FEE_CONFIRMATIONS || 1,
);
const COMPANY_RECEIVING_ACCOUNT_ADDRESS = process.env.NEXT_PUBLIC_COMPANY_RECEIVING_ACCOUNT_ADDRESS;
const USDT_CONTRACT = process.env.NEXT_PUBLIC_USDT_CONTRACT;

// minimal ERC20 ABI (same concept as backend)
const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

export const sendPlatformFee = async ({
  type, // "mining" | "buy_stacking_plan"
  planBuyAmount, // "10" | "20" etc (USDT human amount as string)
}:SendPlatformFeeArgs) => {
  try {
    if (!window.ethereum) {
      return { success: false, message: "Wallet provider not found." };
    }
    if (!COMPANY_RECEIVING_ACCOUNT_ADDRESS) {
      return { success: false, message: "Platform fee address missing." };
    }
    if (!ethers.isAddress(COMPANY_RECEIVING_ACCOUNT_ADDRESS)) {
  return { success: false, message: "Invalid platform fee address." };
}

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userWalletAddress = await signer.getAddress();
    const network = await provider.getNetwork();
    const EXPECTED_CHAIN_ID = BigInt(process.env.NEXT_PUBLIC_CHAIN_ID || "204");
    if (network.chainId !== EXPECTED_CHAIN_ID) {
      return { success: false, message: "Please switch to opBNB network." };
    }

    let txResponse:ethers.TransactionResponse;

    // ✅ 1) MINING => native BNB transfer on opBNB
    if (type === "mining") {
      if (!PLATFORM_FEE_BNB || PLATFORM_FEE_BNB === "0") {
        return { success: false, message: "Mining fee not configured." };
      }

      txResponse = await signer.sendTransaction({
        to: COMPANY_RECEIVING_ACCOUNT_ADDRESS,
        value: ethers.parseEther(String(PLATFORM_FEE_BNB)),
      });
    }

    // ✅ 2) PLAN BUY => USDT ERC20 transfer on opBNB
    else if (type === "buy_stacking_plan") {
      const usdtContractAddress = USDT_CONTRACT;
        
      if ( (!usdtContractAddress || !ethers.isAddress(usdtContractAddress))) {
     return { success: false, message: "Invalid USDT contract address." };
     }
      
      if (!planBuyAmount ||isNaN(Number(planBuyAmount)) || Number(planBuyAmount) <= 0) {
        return { success: false, message: "Invalid plan amount." };
      }
      const usdt = new ethers.Contract(usdtContractAddress, ERC20_ABI, signer);

      // fetch decimals from chain (safe for opBNB USDT)
      const decimals = Number(await usdt.decimals());
      const amountInSmallestUnits = ethers.parseUnits(
        String(planBuyAmount),
        decimals,
      );

      // ERC20 transfer (NOT native)
      txResponse = await usdt.transfer(
        COMPANY_RECEIVING_ACCOUNT_ADDRESS,
        amountInSmallestUnits,
      );
    } else {
      return { success: false, message: "Invalid payment type." };
    }

    toast.info(Messages?.WAIT_MESSAGE("for confirmations"));
    const receipt = await txResponse.wait(CONFIRMATIONS);

    if (!receipt || receipt.status !== 1) {
      return { success: false, message: "Transaction failed on-chain." };
    }

    // ethers v6 receipt has transactionHash
    let feeTxHash = receipt.hash || null;
    feeTxHash = normalizeTxHash(feeTxHash)

    return { success: true, message: "Platform fee sent successfully.", feeTxHash, userWalletAddress };

    
} catch (error: any) {
  console.error("sendPlatformFee error:", error);

  // Common user-friendly cases
  if (error?.code === "ACTION_REJECTED") {
    // user cancelled in wallet
    return { success: false, message: "Transaction cancelled in wallet." };
  }

  // Insufficient funds for GAS (BNB)
  // ethers sometimes uses INSUFFICIENT_FUNDS
  if (error?.code === "INSUFFICIENT_FUNDS") {
    return {
      success: false,
      message:
        "Insufficient BNB for network gas fee. Please add a small amount of BNB to your wallet and try again.",
    };
  }

  // Some wallets throw different messages
  const msg = String(error?.shortMessage || error?.message || "");
  if (msg.toLowerCase().includes("insufficient funds")) {
    return {
      success: false,
      message:
        "Insufficient BNB for network gas fee. Please add a small amount of BNB to your wallet and try again.",
    };
  }

  return { success: false, message: msg || "Payment failed" };
}
};
