export const saveData = async (storeName, data) => {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);

    const request = store.put(data); // put = insert or update

    request.onsuccess = () => resolve("Data saved");
    request.onerror = () => reject(request.error);
  });
}