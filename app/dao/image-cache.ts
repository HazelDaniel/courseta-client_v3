import { IDBPDatabase } from "idb";
import { STORE_NAME, openDBConnection } from "~/utils/indexeddb";

interface ImageData {
  id: string;
  updated_at: number;
  image_text: string;
}

export class ImageCacheDAO {
  private dbPromise: Promise<IDBPDatabase>;
  private static _instance: ImageCacheDAO | null = null;

  constructor() {
    this.dbPromise = openDBConnection();
  }

  static get instance() {
    if (!this._instance) return new ImageCacheDAO();
    return this._instance;
  }
  private async getDB(): Promise<IDBPDatabase> {
    return this.dbPromise;
  }

  async get(image_id: string): Promise<ImageData | undefined> {
    const db = await this.getDB();
    return db.get(STORE_NAME, image_id);
  }

  async put(data: ImageData): Promise<void> {
    const db = await this.getDB();
    await db.put(STORE_NAME, data);
  }

  async post(data: ImageData): Promise<void> {
    console.log("we are updating the indexeddb");
    return this.put(data);
  }

  async delete(image_id: string): Promise<void> {
    const db = await this.getDB();
    await db.delete(STORE_NAME, image_id);
  }
}

export default ImageCacheDAO;
