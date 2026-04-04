import express from "express";
import cors from "cors";
import productsRouter from "./routes/products.js";
import cartRouter from "./routes/cart.js";
import ordersRouter from "./routes/orders.js";
import { handleStripeWebhook } from "./routes/stripe-webhook.js";

export const app = express();

app.use(cors());
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "leyne-api",
  });
});

app.use("/api", productsRouter);
app.use("/api", cartRouter);
app.use("/api", ordersRouter);
