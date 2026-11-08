import express from "express";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/auth.js";

export function createApp() {
  const app = express();

  app.use(express.json({ limit: "20kb" }));

  app.get("/api/health", (req, res) => {
    res.json({ ok: true });
  });

  app.use("/api/auth", authRouter);
  app.use('/api', notFound)
  app.use(errorHandler)
  return app;
}
