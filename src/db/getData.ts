import { STORES_NAME } from "@/config/dbConfig";
import { openDB } from "./indexDB";
import { normalizeWalletAddress } from "@/utils/func";

export const getUserData = async (walletAddress:any) => {
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES_NAME?.user, "readonly");
      const store = tx.objectStore(STORES_NAME?.user);

      const normalizedWallet = normalizeWalletAddress(walletAddress);
      const request = store.get(normalizedWallet);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

export const deleteUserData = async (walletAddress:any) => {
  try {
    const db = await openDB();

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES_NAME?.user, "readwrite");
      const store = tx.objectStore(STORES_NAME?.user);

      const normalizedWallet = normalizeWalletAddress(walletAddress);
      const request = store.delete(normalizedWallet);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error("Error deleting user data:", error);
    return false;
  }
};