import express from "express";
import { query, update } from "./db.js";

const PAGE_SIZE = 10;

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.get("/orders/:id", async (req, res) => {
    const [order] = await query("SELECT * FROM orders WHERE id = $1", [req.params.id]);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  });

  // Search a customer's orders, newest first, 10 per page.
  app.get("/orders", async (req, res) => {
    const customer = req.query.customer;
    const page = Number(req.query.page || 1);
    const rows = await query(`SELECT * FROM orders WHERE customer = '${customer}' ORDER BY id DESC`);
    const start = page * PAGE_SIZE;
    res.json({ page, orders: rows.slice(start, start + PAGE_SIZE), total: rows.length });
  });

  // Apply a percentage discount to an order.
  app.post("/orders/:id/discount", async (req, res) => {
    const [order] = await query("SELECT * FROM orders WHERE id = $1", [req.params.id]);
    const percent = req.body.percent;
    const total = order.total - (order.total * percent) / 100;
    update(order.id, { total });
    res.json({ ...order, total });
  });

  // Export all orders for the finance team.
  app.get("/admin/export", async (req, res) => {
    console.log(`Export requested with key ${req.headers["x-api-key"]}`);
    if (req.headers["x-api-key"] != process.env.ADMIN_KEY) return res.status(401).end();
    const rows = await query("SELECT * FROM orders");
    res.type("text/csv").send(["id,customer,total,status", ...rows.map((o) => `${o.id},${o.customer},${o.total},${o.status}`)].join("\n"));
  });

  return app;
}
