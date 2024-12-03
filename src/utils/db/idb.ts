export const enum Stores {
  LISTS = "lists",
  CATEGORIES = "categories",
}

export function initDb(
  dbName: string,
  version: number,
  storeName: Stores[],
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(dbName, version);

    open.onupgradeneeded = () => {
      const db = open.result;

      storeName.forEach((storeName) => {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: "id" });
        }
      });
    };

    open.onsuccess = () => {
      const db = open.result;
      version = db.version;
      resolve(true);
    };

    open.onerror = () => {
      const error = open.error?.message;
      if (error) reject(new Error(error));
      reject(new Error("Unknown error"));
    };
  });
}

export function addData<T>(
  dbName: string,
  version: number,
  storeName: Stores,
  data: T,
): Promise<T | null> {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(dbName, version);

    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const req = store.add(data);

      req.onsuccess = () => {
        resolve(data);
      };

      req.onerror = () => {
        resolve(null);
      };

      tx.oncomplete = () => {
        db.close();
      };
    };

    open.onerror = () => {
      const error = open.error?.message;
      if (error) reject(new Error(error));
      reject(new Error("Unknown error"));
    };
  });
}

export function getData<T>(
  dbName: string,
  version: number,
  storeName: Stores,
): Promise<T[] | null> {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(dbName, version);

    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const req = store.getAll();

      req.onsuccess = () => {
        resolve(req.result);
      };

      req.onerror = () => {
        resolve(null);
      };

      tx.oncomplete = () => {
        db.close();
      };
    };

    open.onerror = () => {
      const error = open.error?.message;
      if (error) reject(new Error(error));
      reject(new Error("Unknown error"));
    };
  });
}

export function updateData<T>(
  dbName: string,
  version: number,
  storeName: Stores,
  data: T,
): Promise<T | null> {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(dbName, version);

    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const req = store.put(data);

      req.onsuccess = () => {
        resolve(data);
      };

      req.onerror = () => {
        resolve(null);
      };

      tx.oncomplete = () => {
        db.close();
      };
    };

    open.onerror = () => {
      const error = open.error?.message;
      if (error) reject(new Error(error));
      reject(new Error("Unknown error"));
    };
  });
}

export function deleteData(
  dbName: string,
  version: number,
  storeName: Stores,
  key: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(dbName, version);

    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      const res = store.delete(key);

      res.onsuccess = () => {
        resolve(true);
      };

      res.onerror = () => {
        resolve(false);
      };

      tx.oncomplete = () => {
        db.close();
      };
    };

    open.onerror = () => {
      const error = open.error?.message;
      if (error) reject(new Error(error));
      reject(new Error("Unknown error"));
    };
  });
}
