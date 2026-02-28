export const getData = async (storeName, walletAddress) => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);

    const request = store.get(walletAddress);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}