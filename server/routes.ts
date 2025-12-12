import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertProjectSchema, type Project } from "@shared/schema";

const PROJECTS_FILE = path.join(process.cwd(), "server/data/projects.json");
const UPLOADS_DIR = path.join(process.cwd(), "client/public/uploads");

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|webm|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname || mimetype) {
      return cb(null, true);
    }
    cb(new Error("Solo se permiten imágenes, videos y PDFs"));
  },
});

// Helper functions
function readProjects(): Project[] {
  try {
    const data = fs.readFileSync(PROJECTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeProjects(projects: Project[]): void {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Auth middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!(req.session as any).adminAuth) {
    return res.status(401).json({ error: "No autorizado" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin authentication endpoints
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return res.status(500).json({ error: "Contraseña no configurada en servidor" });
    }

    if (password === adminPassword) {
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

  // Public project endpoints
  app.get("/api/projects/list", (req, res) => {
    try {
      const projects = readProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Error al leer proyectos" });
    }
  });

  app.get("/api/projects/:id", (req, res) => {
    try {
      const projects = readProjects();
      const project = projects.find((p) => p.id === req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Proyecto no encontrado" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Error al leer proyecto" });
    }
  });

  // Admin project endpoints (protected)
  app.post(
    "/api/projects/create",
    requireAdmin,
    upload.fields([
      { name: "masterPlanFiles", maxCount: 20 },
      { name: "imagenes", maxCount: 30 },
      { name: "videos", maxCount: 10 },
    ]),
    (req, res) => {
      try {
        const body = req.body;
        
        // Parse JSON fields that come as strings
        if (typeof body.maps === "string") {
          try {
            body.maps = JSON.parse(body.maps);
          } catch {
            body.maps = {};
          }
        }
        if (typeof body.caracteristicas === "string") {
          try {
            body.caracteristicas = JSON.parse(body.caracteristicas);
          } catch {
            body.caracteristicas = [];
          }
        }
        if (typeof body.servicios === "string") {
          try {
            body.servicios = JSON.parse(body.servicios);
          } catch {
            body.servicios = [];
          }
        }
        if (typeof body.amenidades === "string") {
          try {
            body.amenidades = JSON.parse(body.amenidades);
          } catch {
            body.amenidades = [];
          }
        }

        const validation = insertProjectSchema.safeParse(body);
        if (!validation.success) {
          return res.status(400).json({ error: validation.error.errors });
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        
        const newProject: Project = {
          id: generateId(),
          ...validation.data,
          maps: validation.data.maps || {},
          masterPlanFiles: files?.masterPlanFiles?.map((f) => `/uploads/${f.filename}`) || [],
          imagenes: files?.imagenes?.map((f) => `/uploads/${f.filename}`) || [],
          videos: files?.videos?.map((f) => `/uploads/${f.filename}`) || [],
          updatedAt: new Date().toISOString(),
        };

        const projects = readProjects();
        projects.push(newProject);
        writeProjects(projects);

        res.status(201).json(newProject);
      } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ error: "Error al crear proyecto" });
      }
    }
  );

  app.put(
    "/api/projects/update/:id",
    requireAdmin,
    upload.fields([
      { name: "masterPlanFiles", maxCount: 20 },
      { name: "imagenes", maxCount: 30 },
      { name: "videos", maxCount: 10 },
    ]),
    (req, res) => {
      try {
        const projects = readProjects();
        const index = projects.findIndex((p) => p.id === req.params.id);
        
        if (index === -1) {
          return res.status(404).json({ error: "Proyecto no encontrado" });
        }

        const body = req.body;
        
        // Parse JSON fields
        if (typeof body.maps === "string") {
          try {
            body.maps = JSON.parse(body.maps);
          } catch {
            body.maps = {};
          }
        }
        if (typeof body.caracteristicas === "string") {
          try {
            body.caracteristicas = JSON.parse(body.caracteristicas);
          } catch {
            body.caracteristicas = [];
          }
        }
        if (typeof body.servicios === "string") {
          try {
            body.servicios = JSON.parse(body.servicios);
          } catch {
            body.servicios = [];
          }
        }
        if (typeof body.amenidades === "string") {
          try {
            body.amenidades = JSON.parse(body.amenidades);
          } catch {
            body.amenidades = [];
          }
        }

        // Parse existing files to keep
        let existingMasterPlan: string[] = [];
        let existingImagenes: string[] = [];
        let existingVideos: string[] = [];
        
        if (typeof body.existingMasterPlanFiles === "string") {
          try {
            existingMasterPlan = JSON.parse(body.existingMasterPlanFiles);
          } catch {
            existingMasterPlan = [];
          }
        }
        if (typeof body.existingImagenes === "string") {
          try {
            existingImagenes = JSON.parse(body.existingImagenes);
          } catch {
            existingImagenes = [];
          }
        }
        if (typeof body.existingVideos === "string") {
          try {
            existingVideos = JSON.parse(body.existingVideos);
          } catch {
            existingVideos = [];
          }
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const newMasterPlan = files?.masterPlanFiles?.map((f) => `/uploads/${f.filename}`) || [];
        const newImagenes = files?.imagenes?.map((f) => `/uploads/${f.filename}`) || [];
        const newVideos = files?.videos?.map((f) => `/uploads/${f.filename}`) || [];

        // Delete removed files
        const oldProject = projects[index];
        const filesToDelete = [
          ...oldProject.masterPlanFiles.filter((f) => !existingMasterPlan.includes(f)),
          ...oldProject.imagenes.filter((f) => !existingImagenes.includes(f)),
          ...oldProject.videos.filter((f) => !existingVideos.includes(f)),
        ];

        filesToDelete.forEach((filePath) => {
          const fullPath = path.join(process.cwd(), "client/public", filePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        });

        const updatedProject: Project = {
          ...oldProject,
          nombre: body.nombre || oldProject.nombre,
          tipo: body.tipo || oldProject.tipo,
          etapa: body.etapa || oldProject.etapa,
          ubicacionTexto: body.ubicacionTexto || oldProject.ubicacionTexto,
          descripcion: body.descripcion || oldProject.descripcion,
          contenidoLargo: body.contenidoLargo ?? oldProject.contenidoLargo,
          maps: body.maps || oldProject.maps,
          linkLotes: body.linkLotes ?? oldProject.linkLotes,
          caracteristicas: body.caracteristicas || oldProject.caracteristicas,
          servicios: body.servicios || oldProject.servicios,
          amenidades: body.amenidades || oldProject.amenidades,
          superficie: body.superficie ?? oldProject.superficie,
          lotes: body.lotes ?? oldProject.lotes,
          masterPlanFiles: [...existingMasterPlan, ...newMasterPlan],
          imagenes: [...existingImagenes, ...newImagenes],
          videos: [...existingVideos, ...newVideos],
          updatedAt: new Date().toISOString(),
        };

        projects[index] = updatedProject;
        writeProjects(projects);

        res.json(updatedProject);
      } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ error: "Error al actualizar proyecto" });
      }
    }
  );

  app.delete("/api/projects/delete/:id", requireAdmin, (req, res) => {
    try {
      const projects = readProjects();
      const index = projects.findIndex((p) => p.id === req.params.id);
      
      if (index === -1) {
        return res.status(404).json({ error: "Proyecto no encontrado" });
      }

      const project = projects[index];
      
      // Delete associated files
      const allFiles = [
        ...project.masterPlanFiles,
        ...project.imagenes,
        ...project.videos,
      ];

      allFiles.forEach((filePath) => {
        const fullPath = path.join(process.cwd(), "client/public", filePath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });

      projects.splice(index, 1);
      writeProjects(projects);

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Error al eliminar proyecto" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
