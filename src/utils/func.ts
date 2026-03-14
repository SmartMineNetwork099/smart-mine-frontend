import moment from "moment";
import { ethers } from "ethers";


// function seconds to h:m:s format
export const formatTime = (seconds: number) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hrs > 0 ? `${String(hrs).padStart(2, "0")}h : ` : ""}${String(mins).padStart(2, "0")}m : ${String(secs).padStart(2, "0")}s`;
};

export const formatAmount = (value: any) => {
  // Step 1: Handle undefined / null / NaN
  let num = Number(value ?? 0);
  if (!Number.isFinite(num)) num = 0;

  // Step 2: Remove negative values
  if (num < 0) num = 0;

  // Step 3: Truncate (not round) to 4 decimals
  num = Math.trunc(num * 10000) / 10000;

  // Step 4: Always return string with 4 decimals
  return num.toFixed(4);
};

 export const formatWalletAddress = (addr: any) => {
    if (!addr) return 'N/A';
    const s = String(addr);
    if (s.length <= 10) return s;
    return `${s.slice(0, 6)}....${s.slice(-6)}`;
  };

  export const formatDate = (dateString: string | Date | undefined): string => {
    console.log(dateString, 'datestringggg')
  if (!dateString) return 'N/A';
  return moment(dateString).format("DD-MMMM-YYYY hh:mm A");
}; 

export const normalizeWalletAddress = (walletAddress:any) => {
  if (!walletAddress || typeof walletAddress !== "string") {
    return null;
  }
   const addr = walletAddress.trim();

  if (!ethers.isAddress(addr)) {
    return null;
  }
  return addr.toLowerCase();
};

export const normalizeTxHash = (txHash:any) => {
  if (!txHash || typeof txHash !== "string") {
    return null;
  }

  const hash = txHash.trim();

  // validate tx hash (0x + 64 hex chars)
  if (!ethers.isHexString(hash, 32)) {
    return null;
  }

  return hash.toLowerCase();
};