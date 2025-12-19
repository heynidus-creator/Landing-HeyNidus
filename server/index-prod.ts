import fs from "node:fs";
import path from "node:path";
import { type Server } from "node:http";

import express, { type Express } from "express";
import runApp from "./app";

export async function serveStatic(app: Express, _server: Server) {
  const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}. Run "npm run build" first.`,
    );
  }

  app.use(express.static(distPath));

  // SPA fallback (para rutas tipo /proyecto/1)
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

(async () => {
  // IMPORTANTE:
  // runApp debe encargarse de:
  // - crear el server y hacer listen en process.env.PORT (Replit Publish)
  // - montar rutas /api/*
  // - llamar a serveStatic(app, server) en prod
  await runApp(serveStatic);
})();
