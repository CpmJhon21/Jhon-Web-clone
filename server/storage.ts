
import { db } from "./db";
import {
  images,
  type Image,
  type InsertImage,
} from "@shared/schema";
import { eq, desc, lt } from "drizzle-orm";

export interface IStorage {
  getImages(): Promise<Image[]>;
  getImage(id: number): Promise<Image | undefined>;
  createImage(image: InsertImage): Promise<Image>;
  cleanupOldImages(minutes: number): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getImages(): Promise<Image[]> {
    return await db.select().from(images).orderBy(desc(images.createdAt));
  }

  async getImage(id: number): Promise<Image | undefined> {
    const [image] = await db.select().from(images).where(eq(images.id, id));
    return image;
  }

  async createImage(insertImage: InsertImage): Promise<Image> {
    const [image] = await db.insert(images).values(insertImage).returning();
    return image;
  }

  async cleanupOldImages(minutes: number): Promise<number> {
    const threshold = new Date(Date.now() - minutes * 60000);
    const result = await db.delete(images).where(lt(images.createdAt, threshold)).returning();
    return result.length;
  }
}

export const storage = new DatabaseStorage();
