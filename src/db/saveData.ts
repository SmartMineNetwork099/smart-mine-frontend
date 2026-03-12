import { STORES_NAME } from "@/config/dbConfig";
import { openDB } from "./indexDB";
import { normalizeWalletAddress } from "@/utils/func";

function reqToPromise<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function txToPromise(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export const upsertUserData = async (
  walletAddress: string,
  data: Record<string, any>
) => {
  const db = await openDB();
  const key = normalizeWalletAddress(walletAddress);

  const tx = db.transaction(STORES_NAME.user, "readwrite");
  const store = tx.objectStore(STORES_NAME.user);

  // ✅ Get existing record correctly
  const existing = (await reqToPromise<any>(store.get(key))) || {};

  // ✅ Merge and put
  await reqToPromise(store.put({
    ...existing,
    ...data,
    walletAddress: key, // keyPath must remain
  }));

  // ✅ wait transaction complete
  await txToPromise(tx);
};