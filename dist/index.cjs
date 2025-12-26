import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* =========================
   SERVE CLIENT (HTML)
========================= */
app.use(
  express.static(
    path.join(__dirname, "../client")
  )
);

/* =========================
   API ROUTES
========================= */
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "API running on Vercel (serverless)",
  });
});

/* =========================
   FALLBACK KE index.html
========================= */
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../client/index.html")
  );
});

export default app;
