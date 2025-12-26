import express from "express";

const app = express();

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   ROUTES
========================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API running on Vercel (serverless)",
  });
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/* =========================
   EXPORT FOR VERCEL
   ❌ NO app.listen()
========================= */
export default app;
