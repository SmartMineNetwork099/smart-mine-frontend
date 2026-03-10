import Messages from "@/constants/messages";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { normalizeTxHash } from "@/utils/func";

type SendPlatformFeeArgs = {
  type: "mining" | "buy_stacking_plan" | "freeze_fee";
  planBuyAmount?: string;
  freezeFeeBnb?: string;
};

const PLATFORM_FEE_BNB =
  process.env.NEXT_PUBLIC_PLATFORM_FEE_FOR_MINING || "0";

const CONFIRMATIONS = Number(
  process.env.NEXT_PUBLIC_MIN_FEE_CONFIRMATIONS || 1,
);

const COMPANY_RECEIVING_ACCOUNT_ADDRESS =
  process.env.NEXT_PUBLIC_COMPANY_RECEIVING_ACCOUNT_ADDRESS;

const USDT_CONTRACT = process.env.NEXT_PUBLIC_USDT_CONTRACT;

// minimal ERC20 ABI (same concept as backend)
const ERC20_ABI = [
  "function decimals() view returns (uint8)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
];

export const sendPlatformFee = async ({
  type, // "mining" | "buy_stacking_plan"
  planBuyAmount,  // "10" | "20" etc (USDT human amount as string)
  freezeFeeBnb,
}: SendPlatformFeeArgs) => {
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
    const EXPECTED_CHAIN_ID = BigInt(
      process.env.NEXT_PUBLIC_CHAIN_ID || "204",
    );

    if (network.chainId !== EXPECTED_CHAIN_ID) {
      return { success: false, message: "Please switch to opBNB network." };
    }

    const userBnbBalance = await provider.getBalance(userWalletAddress);

    let txResponse: ethers.TransactionResponse;

    // ===============================
    // 1️⃣ MINING (BNB TRANSFER) on opbnb
    // ===============================
    if (type === "mining") {
      const feeWei = ethers.parseEther(String(PLATFORM_FEE_BNB));

      // estimate gas
      const gasLimit = await provider.estimateGas({
        from: userWalletAddress,
        to: COMPANY_RECEIVING_ACCOUNT_ADDRESS,
        value: feeWei,
      });

      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice ?? BigInt(0);

      const gasCost = gasLimit * gasPrice;
      const totalRequired = feeWei + gasCost;

      if (userBnbBalance < totalRequired) {
        return {
          success: false,
          message:
            "Insufficient BNB balance for fee + gas. Please add more BNB.",
        };
      }

      txResponse = await signer.sendTransaction({
        to: COMPANY_RECEIVING_ACCOUNT_ADDRESS,
        value: feeWei,
      });
    }

    // ===============================
    // 2️⃣ BUY PLAN (USDT ERC20 TRANSFER) on opbnb network 
    // ===============================
    else if (type === "buy_stacking_plan") {
      const usdtContractAddress = USDT_CONTRACT;

      if (!usdtContractAddress || !ethers.isAddress(usdtContractAddress)) {
        return { success: false, message: "Invalid USDT contract address." };
      }

      if (
        !planBuyAmount ||
        isNaN(Number(planBuyAmount)) ||
        Number(planBuyAmount) <= 0
      ) {
        return { success: false, message: "Invalid plan amount." };
      }

      const usdt = new ethers.Contract(usdtContractAddress, ERC20_ABI, signer);

      const decimals = Number(await usdt.decimals());

      const amount = ethers.parseUnits(String(planBuyAmount), decimals);

      const userUsdtBalance: bigint = await usdt.balanceOf(userWalletAddress);

      if (userUsdtBalance < amount) {
        return {
          success: false,
          message: "Insufficient USDT balance.",
        };
      }

      // estimate gas for ERC20 transfer
      const gasLimit = await usdt.transfer.estimateGas(
        COMPANY_RECEIVING_ACCOUNT_ADDRESS,
        amount,
      );

      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice ?? BigInt(0);

      const gasCost = gasLimit * gasPrice;

      if (userBnbBalance < gasCost) {
        return {
          success: false,
          message:
            "Insufficient BNB for gas fee. Please add small amount of BNB.",
        };
      }

      txResponse = await usdt.transfer(
        COMPANY_RECEIVING_ACCOUNT_ADDRESS,
        amount,
      );
    }

    // ===============================
    // 3️⃣ FREEZE FEE (BNB)
    // ===============================
    else if (type === "freeze_fee") {
      if (
        !freezeFeeBnb ||
        isNaN(Number(freezeFeeBnb)) ||
        Number(freezeFeeBnb) <= 0
      )  {
        return { success: false, message: "Invalid freeze fee amount." };
      }

      const feeWei = ethers.parseEther(String(freezeFeeBnb));

      const gasLimit = await provider.estimateGas({
        from: userWalletAddress,
        to: COMPANY_RECEIVING_ACCOUNT_ADDRESS,
        value: feeWei,
      });

      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice ?? BigInt(0);

      const gasCost = gasLimit * gasPrice;
      const totalRequired = feeWei + gasCost;

      if (userBnbBalance < totalRequired) {
        return {
          success: false,
          message:
            "Insufficient BNB balance for freeze fee + gas.",
        };
      }

      txResponse = await signer.sendTransaction({
        to: COMPANY_RECEIVING_ACCOUNT_ADDRESS,
        value: feeWei,
      });
    } else {
      return { success: false, message: "Invalid payment type." };
    }

    toast.info(Messages?.WAIT_MESSAGE("for confirmations"));

    const receipt = await txResponse.wait(CONFIRMATIONS);

    if (!receipt || receipt.status !== 1) {
      return { success: false, message: "Transaction failed on-chain." };
    }

    let feeTxHash = receipt.hash || null;
    feeTxHash = normalizeTxHash(feeTxHash);

    return {
      success: true,
      message: "Platform fee sent successfully.",
      feeTxHash,
      userWalletAddress,
    };
  } catch (error: any) {
    console.error("sendPlatformFee error:", error);

    if (error?.code === "ACTION_REJECTED") {
      return { success: false, message: "Transaction cancelled in wallet." };
    }

    const msg = String(error?.shortMessage || error?.message || "");

    if (msg.toLowerCase().includes("insufficient funds")) {
      return {
        success: false,
        message:
          "Insufficient BNB for network gas fee.",
      };
    }

    return { success: false, message: msg || "Payment failed" };
  }
};