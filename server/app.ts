import { type Server } from "node:http";

import express, {
  type Express,
  type Request,
  Response,
  NextFunction,
} from "express";
import session from "express-session";
import MemoryStore from "memorystore";

import { registerRoutes } from "./routes";

const SessionStore = MemoryStore(session);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export const app = express();

/**
 * Necesario para cookies "secure" detrás de proxy (Replit / Vercel / etc).
 * Sin esto, en producción puede NO setear cookie y te da 401.
 */
app.set("trust proxy", 1);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

declare global {
  namespace Express {
    interface Session {
      adminAuth?: boolean;
    }
  }
}

// Body parsers (guardamos rawBody por si lo usan para webhooks / firmas)
app.use(
  express.json({
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf;
    },
  }),
);
app.use(express.urlencoded({ extended: false }));

/**
 * Sesión:
 * - En prod: cookie secure (HTTPS) + sameSite lax (ok para navegación normal)
 * - trust proxy habilitado arriba para que secure funcione detrás de proxy
 */
app.use(
  session({
    store: new SessionStore({
      checkPeriod: 86400000, // 24hs
    }),
    secret: process.env.SESSION_SECRET || "heynidus-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

// Logger de requests /api/*
app.use((req, res, next) => {
  const start = Date.now();
  const p = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json.bind(res);
  (res as any).json = (bodyJson: any, ...args: any[]) => {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson, ...args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (p.startsWith("/api")) {
      let logLine = `${req.method} ${p} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse)
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      if (logLine.length > 160) logLine = logLine.slice(0, 159) + "…";
      log(logLine);
    }
  });

  next();
});

export default async function runApp(
  setup: (app: Express, server: Server) => Promise<void>,
) {
  // 1) Monta rutas API y devuelve el http server
  const server = await registerRoutes(app);

  // 2) Error handler: NO tirar throw (eso te puede crashear el proceso en prod)
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err?.status || err?.statusCode || 500;
    const message = err?.message || "Internal Server Error";
    // logueamos para debug
    log(`ERROR ${status}: ${message}`, "error");
    res.status(status).json({ error: message });
  });

  // 3) Setup final (estáticos + SPA fallback) SIEMPRE al final
  await setup(app, server);

  // 4) Listen (solo una vez)
  const port = Number(process.env.PORT || 5000);
  const host = "0.0.0.0";

  const alreadyListening = (server as any).listening === true;
  if (!alreadyListening) {
    server.listen(port, host, () => {
      log(`serving on http://${host}:${port}`);
    });
  } else {
    log("server already listening (skipping listen)", "express");
  }

  return server;
}
