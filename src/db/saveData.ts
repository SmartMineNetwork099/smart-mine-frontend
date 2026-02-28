import { STORES_NAME } from "@/config/dbConfig";
import { openDB } from "./indexDB";

export const saveUserData  = async (walletAddress:any, data:any) => {
  const db = await openDB();

  const tx = db.transaction(STORES_NAME?.user, "readwrite");
  const store = tx.objectStore(STORES_NAME.user);

  await store.put({
    walletAddress: walletAddress.toLowerCase(),
    ...data,
  });

  return tx.complete;
}