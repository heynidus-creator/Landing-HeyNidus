import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin authentication endpoints
  
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return res.status(500).json({ error: "Contraseña no configurada en servidor" });
    }

    if (password === adminPassword) {
      // Crear sesión
      (req.session as any).adminAuth = true;
      req.session.save((err: any) => {
        if (err) {
          return res.status(500).json({ error: "Error al crear sesión" });
        }
        res.json({ success: true });
      });
    } else {
      res.status(401).json({ error: "Contraseña incorrecta" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ error: "Error al cerrar sesión" });
      }
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });

  app.get("/api/admin/me", (req, res) => {
    const isAuthenticated = !!(req.session as any).adminAuth;
    
    if (isAuthenticated) {
      res.json({ authenticated: true });
    } else {
      res.status(401).json({ authenticated: false });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
