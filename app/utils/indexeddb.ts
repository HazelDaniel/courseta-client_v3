import { openDB, IDBPDatabase } from 'idb';

export const DB_NAME = 'myDatabase';
export const DB_VERSION = 1;
export const STORE_NAME = 'courseta_images';

export const openDBConnection = async (): Promise<IDBPDatabase> => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('updated_at', 'updated_at');
        store.createIndex('image_text', 'image_text');
      }
    }
  });
};