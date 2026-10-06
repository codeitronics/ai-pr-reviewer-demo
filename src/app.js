import express from "express";
import { query } from "./db.js";

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.get("/orders/:id", async (req, res) => {
    const [order] = await query("SELECT * FROM orders WHERE id = $1", [req.params.id]);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  });

  return app;
}
