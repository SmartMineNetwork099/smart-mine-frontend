import Messages from "@/constants/messages";
import { ethers } from "ethers";
import { toast } from "react-toastify";

const PLATFORM_FEE = Number(process.env.NEXT_PUBLIC_PLATFORM_FEE_FOR_MINING)
const CONFIRMATIONS = Number(process.env.NEXT_PUBLIC_MIN_FEE_CONFIRMATIONS);
const PLATFORM_FEE_ADDRESS = process.env.NEXT_PUBLIC_PLATFORM_FEE_ADDRESS;

export const sendPlatformFee = async (miningFee=false , miningPlanBuy=false , miningPlanBuyAmount) => {
  try {
    if (!(window).ethereum) {
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
    if (!miningFee && !miningPlanBuy)
       return { success: false, message: "Invalid payment type." };
    let txResponse;
    // 🔹 Send transaction (user approves via wallet)
    if(miningFee){
          txResponse = await signer.sendTransaction({
            to: PLATFORM_FEE_ADDRESS,
            value: ethers.parseUnits(PLATFORM_FEE, "ether"),
        });
    }
    else if(miningPlanBuy){
         txResponse = await signer.sendTransaction({
            to: PLATFORM_FEE_ADDRESS,
            value: ethers.parseUnits(miningPlanBuyAmount, "ether"),
        });
    }

    // Notify user
    toast.info(Messages?.WAIT_MESSAGE("for confirmations"));
    const receipt = await txResponse.wait(CONFIRMATIONS);

    if (!receipt || receipt.status !== 1) {
      return { success: false, message: "Fee transaction failed on-chain." };
    }

    // ✅ Extract tx hash safely
    const feeTxHash =
      "transactionHash" in receipt
        ? receipt.transactionHash
        : (receipt).hash;

    return { success: true, feeTxHash, userWalletAddress };
  } catch (error) {
    console.error("sendPlatformFee error:", error);
    return { success: false, message: error.message };
  }
};

