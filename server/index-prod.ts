import fs from "node:fs";
import path from "node:path";
import { createServer, type Server } from "node:http";

import express, { type Express } from "express";
import runApp from "./app";

export async function serveStatic(app: Express, _server: Server) {
  const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

(async () => {
  // runApp debería registrar routes + middlewares sobre una Express app
  // y usar serveStatic para el build.
  const maybeServer = await runApp(serveStatic);

  // 🔥 Si runApp devuelve un server, lo usamos. Si no, creamos uno igual.
  // (Esto lo hace "a prueba de variantes" según cómo esté implementado app.ts)
  let server: Server | null = null;

  if (maybeServer && typeof (maybeServer as any).listen === "function") {
    server = maybeServer as Server;
  } else if (
    maybeServer &&
    (maybeServer as any).server &&
    typeof (maybeServer as any).server.listen === "function"
  ) {
    server = (maybeServer as any).server as Server;
  }

  // Si no vino server desde runApp, intentamos armar uno mínimo.
  // OJO: esto solo funcionará si runApp internamente ya creó/expuso `app`.
  // Pero en la mayoría de templates, runApp ya crea el server.
  if (!server) {
    // Fallback: crear un server vacío evita que el proceso termine,
    // pero lo normal es que runApp ya devuelva el server.
    const app = express();
    server = createServer(app);
  }

  const port = Number(process.env.PORT) || 3000;
  const host = "0.0.0.0";

  // ✅ Evitar error si ya estaba escuchando
  const isListening = (server as any).listening === true;
  if (!isListening) {
    server.listen(port, host, () => {
      console.log(`✅ Backend Express activo en http://${host}:${port}`);
    });
  } else {
    console.log(
      "ℹ️ El server ya estaba escuchando (no se llamó listen nuevamente).",
    );
  }
})();
