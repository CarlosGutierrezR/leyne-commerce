import express from "express";
import cors from "cors";
import productsRouter from "./routes/products.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    ok: true,
    service: "leyne-api",
  });
});

app.use("/api", productsRouter);