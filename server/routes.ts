
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auto-cleanup images older than 30 minutes every minute
  setInterval(async () => {
    try {
      const deletedCount = await storage.cleanupOldImages(30);
      if (deletedCount > 0) {
        console.log(`[cleanup] Deleted ${deletedCount} old images`);
      }
    } catch (err) {
      console.error("[cleanup] Error cleaning up old images:", err);
    }
  }, 60000);

  app.get(api.images.list.path, async (req, res) => {
    const images = await storage.getImages();
    res.json(images);
  });

  app.get(api.images.get.path, async (req, res) => {
    const image = await storage.getImage(Number(req.params.id));
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    res.json(image);
  });

  app.post(api.images.create.path, async (req, res) => {
    try {
      const input = api.images.create.input.parse(req.body);
      const image = await storage.createImage(input);
      res.status(201).json(image);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}
