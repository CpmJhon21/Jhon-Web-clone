import type { Express } from "express";
import type { Server } from "http";
import { api } from "@shared/routes";
import { z } from "zod";
import {
  createImage,
  getImages,
  getImageById,
  cleanupOldImages,
} from "./storage";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ⚠️ OPTIONAL: cleanup job (AMAN DI VPS, TIDAK DISARANKAN DI VERCEL)
  if (process.env.VERCEL !== "1") {
    setInterval(async () => {
      try {
        const deletedCount = await cleanupOldImages(30);
        if (deletedCount > 0) {
          console.log(`[cleanup] Deleted ${deletedCount} old images`);
        }
      } catch (err) {
        console.error("[cleanup] Cleanup error:", err);
      }
    }, 60000);
  }

  // GET all images
  app.get(api.images.list.path, async (_req, res) => {
    const images = await getImages();
    res.json(images);
  });

  // GET image by id
  app.get(api.images.get.path, async (req, res) => {
    const image = await getImageById(Number(req.params.id));
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.json(image);
  });

  // POST create image
  app.post(api.images.create.path, async (req, res) => {
    try {
      const input = api.images.create.input.parse(req.body);
      const image = await createImage(input);
      res.status(201).json(image);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }

      console.error("❌ Create image error:", err);
      res.status(500).json({
        message: "Failed to save generated image to server",
      });
    }
  });

  return httpServer;
}
