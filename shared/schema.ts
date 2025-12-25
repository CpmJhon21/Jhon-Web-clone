
import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  originalImageUrl: text("original_image_url").notNull(), // Data URI or URL
  generatedImageUrl: text("generated_image_url").notNull(), // Data URI or URL
  topText: text("top_text"),
  bottomText: text("bottom_text"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertImageSchema = createInsertSchema(images).omit({ 
  id: true, 
  createdAt: true 
});

export type Image = typeof images.$inferSelect;
export type InsertImage = z.infer<typeof insertImageSchema>;

export type CreateImageRequest = InsertImage;
export type ImageResponse = Image;
