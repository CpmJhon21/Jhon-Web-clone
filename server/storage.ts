import { pool } from "./db";

export interface ImageData {
  id?: number;
  original_image_url: string;
  generated_image_url: string;
  top_text?: string;
  bottom_text?: string;
  created_at?: Date;
}

/**
 * CREATE image (dipakai di POST)
 */
async function createImage(data: ImageData) {
  const result = await pool.query(
    `
    INSERT INTO images
    (original_image_url, generated_image_url, top_text, bottom_text)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [
      data.original_image_url,
      data.generated_image_url,
      data.top_text ?? null,
      data.bottom_text ?? null,
    ]
  );

  return result.rows[0];
}

/**
 * GET all images
 */
async function getImages() {
  const result = await pool.query(
    `SELECT * FROM images ORDER BY created_at DESC`
  );
  return result.rows;
}

/**
 * GET image by ID
 */
async function getImage(id: number) {
  const result = await pool.query(
    `SELECT * FROM images WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}

/**
 * DELETE images older than X minutes
 */
async function cleanupOldImages(minutes: number) {
  const result = await pool.query(
    `
    DELETE FROM images
    WHERE created_at < now() - interval '${minutes} minutes'
    `
  );

  return result.rowCount ?? 0;
}

/**
 * EXPORT STORAGE (SESUI ROUTER)
 */
export const storage = {
  createImage,
  getImages,
  getImage,
  cleanupOldImages,
};
