import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  insertProjectSchema,
  insertBlogPostSchema,
  insertTestimonialSchema,
  insertLeadSchema,
  type Project,
  type BlogPost,
  type Testimonial,
  type Lead,
} from "@shared/schema";

const DATA_DIR = path.join(process.cwd(), "server/data");

// ✅ En PROD el frontend compilado vive en dist/public; en DEV vive en client/public
const PUBLIC_DIR =
  process.env.NODE_ENV === "production"
    ? path.join(process.cwd(), "dist", "public")
    : path.join(process.cwd(), "client", "public");

const UPLOADS_DIR = path.join(PUBLIC_DIR, "uploads");

const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");
const BLOG_FILE = path.join(DATA_DIR, "blog.json");
const TESTIMONIALS_FILE = path.join(DATA_DIR, "testimonials.json");
const ANALYTICS_FILE = path.join(DATA_DIR, "analytics.json");
const LEADS_FILE = path.join(DATA_DIR, "leads.json");

// Ensure data and uploads directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

/**
 * Helpers para paths (FIX crítico)
 * - Si guardamos "/uploads/x.jpg", path.join(..., "/uploads/x.jpg") ignora lo anterior.
 * - Estos helpers normalizan y siempre apuntan a PUBLIC_DIR/...
 */
function stripLeadingSlash(p: string) {
  return String(p || "").replace(/^\/+/, "");
}
function publicFileFullPath(filePath: string) {
  const safe = stripLeadingSlash(filePath);
  return path.join(PUBLIC_DIR, safe);
}
function toPublicUrl(filePath: string) {
  if (!filePath) return "";
  return filePath.startsWith("/") ? filePath : `/${filePath}`;
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|webm|pdf/;
    const extOk = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimeOk = allowedTypes.test(String(file.mimetype || "").toLowerCase());
    if (extOk || mimeOk) return cb(null, true);
    cb(new Error("Solo se permiten imágenes, videos y PDFs"));
  },
});

// Seed data for projects (fallback when projects.json doesn't exist)
const SEED_PROJECTS: Project[] = [
  {
    id: "1",
    nombre: "Barrio Capinota",
    tipo: "Proyecto de terceros",
    etapa: "Preventa",
    ubicacionTexto: "Partido de Merlo",
    descripcion:
      "Barrio abierto con 210 lotes de 300 m² cada uno. Preventa de 30 lotes con el mejor precio del mercado. Ventas por etapas.",
    contenidoLargo:
      "Barrio Capinota es un proyecto residencial de magnitud en el Partido de Merlo, con 210 lotes de 300 m² cada uno (10m de frente x 30m de fondo). El master plan responde a un concepto de orden, armonía y funcionalidad. Actualmente se abre la preventa exclusiva con 30 lotes disponibles a los mejores precios del mercado. El proyecto contempla amenidades completas con áreas recreativas, plaza con juegos para niños, y servicios básicos (agua, electricidad, acceso principal). Las ventas se realizarán por etapas, permitiendo a los interesados acceso a vivienda con excelente proyección inmobiliaria.",
    maps: {},
    linkLotes: "",
    caracteristicas: [
      "210 lotes totales de 300 m² (10m x 30m)",
      "Master plan de 210 lotes con acceso optimizado",
      "Calles amplias, uniformes y bien distribuidas",
      "Diseño urbano moderno con concepto de orden y funcionalidad",
      "Oportunidad exclusiva: 30 lotes en preventa con mejor precio del mercado",
      "Ventas por etapas con excelente proyección de valorización",
    ],
    servicios: ["Agua potable", "Electricidad", "Acceso principal"],
    amenidades: [
      "Áreas recreativas",
      "Plaza con juegos para niños",
      "Espacios verdes",
      "Circulaciones amplias",
    ],
    superficie: "63.000 m²",
    lotes: "30 lotes en preventa",
    masterPlanFiles: [],
    imagenes: [],
    videos: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    nombre: "Altos Valles de Glew",
    tipo: "Proyecto de terceros",
    etapa: "Próximamente",
    ubicacionTexto: "Partido de Glew",
    descripcion: "Próximamente",
    contenidoLargo: "",
    maps: {},
    linkLotes: "",
    caracteristicas: [],
    servicios: [],
    amenidades: [],
    superficie: "",
    lotes: "",
    masterPlanFiles: [],
    imagenes: [],
    videos: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    nombre: "Altos de Cañuela",
    tipo: "Proyecto de terceros",
    etapa: "Próximamente",
    ubicacionTexto: "Partido de Cañuelas",
    descripcion:
      "Próximamente. Lotes diseñados para familias que buscan espacio, verde y entorno en desarrollo.",
    contenidoLargo:
      "Altos de Cañuela es un proyecto próximo a lanzarse en el Partido de Cañuelas, pensado para familias que buscan amplitud y contacto con la naturaleza. Los lotes son de gran superficie, perfectos para construir casas con jardines amplios. El entorno tiene una vocación rural pero con planes de urbanización futura, lo que convierte a este proyecto en una excelente inversión a largo plazo.",
    maps: {},
    linkLotes: "",
    caracteristicas: [
      "Lotes amplios con mucho espacio",
      "Entorno rural pero con servicios",
      "Ideales para familias grandes",
      "Proyección de urbanización futura",
    ],
    servicios: ["Acceso principal planificado", "Servicios a proyectar"],
    amenidades: [
      "Mucha vegetación",
      "Conexión con naturaleza",
      "Potencial de desarrollo",
    ],
    superficie: "18.000 m²",
    lotes: "52 lotes",
    masterPlanFiles: [],
    imagenes: [],
    videos: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    nombre: "Valles del Pino",
    tipo: "Proyecto de terceros",
    etapa: "Próximamente",
    ubicacionTexto: "Partido de La Matanza",
    descripcion: "Próximamente",
    contenidoLargo: "",
    maps: {},
    linkLotes: "",
    caracteristicas: [],
    servicios: [],
    amenidades: [],
    superficie: "",
    lotes: "",
    masterPlanFiles: [],
    imagenes: [],
    videos: [],
    updatedAt: new Date().toISOString(),
  },
];

// Helper functions
function readProjects(): Project[] {
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      const data = fs.readFileSync(PROJECTS_FILE, "utf-8");
      const projects = JSON.parse(data);
      if (Array.isArray(projects) && projects.length > 0) return projects;
    }
  } catch {
    // fall through
  }
  return SEED_PROJECTS;
}

function writeProjects(projects: Project[]): void {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

function readBlogPosts(): BlogPost[] {
  try {
    if (!fs.existsSync(BLOG_FILE)) return [];
    const data = fs.readFileSync(BLOG_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeBlogPosts(posts: BlogPost[]): void {
  fs.writeFileSync(BLOG_FILE, JSON.stringify(posts, null, 2));
}

function readTestimonials(): Testimonial[] {
  try {
    if (!fs.existsSync(TESTIMONIALS_FILE)) return [];
    const data = fs.readFileSync(TESTIMONIALS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeTestimonials(testimonials: Testimonial[]): void {
  fs.writeFileSync(TESTIMONIALS_FILE, JSON.stringify(testimonials, null, 2));
}

interface AnalyticsEntry {
  page: string;
  projectId: string | null;
  blogId: string | null;
  source: string;
  seconds: number;
  timestamp: string;
}

interface AnalyticsData {
  pageViews: AnalyticsEntry[];
}

function readAnalytics(): AnalyticsData {
  try {
    if (!fs.existsSync(ANALYTICS_FILE)) return { pageViews: [] };
    const data = fs.readFileSync(ANALYTICS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (!parsed || !Array.isArray(parsed.pageViews)) return { pageViews: [] };
    return parsed;
  } catch {
    return { pageViews: [] };
  }
}

function writeAnalytics(data: AnalyticsData): void {
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(data, null, 2));
}

function readLeads(): Lead[] {
  try {
    if (!fs.existsSync(LEADS_FILE)) return [];
    const data = fs.readFileSync(LEADS_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed?.leads) ? parsed.leads : [];
  } catch {
    return [];
  }
}

function writeLeads(leads: Lead[]): void {
  fs.writeFileSync(LEADS_FILE, JSON.stringify({ leads }, null, 2));
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
  // ==================== ADMIN AUTH ====================
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return res.status(500).json({ error: "Contraseña no configurada" });
    }

    if (password !== adminPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({ error: "Error al iniciar sesión" });
      }

      (req.session as any).adminAuth = true;

      req.session.save((err) => {
        if (err) {
          return res.status(500).json({ error: "Error al guardar sesión" });
        }
        res.json({ success: true });
      });
    });
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy(() => {
      res.clearCookie("admin.sid");
      res.json({ success: true });
    });
  });

  app.get("/api/admin/me", (req, res) => {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    res.setHeader("Pragma", "no-cache");

    const isAuthenticated = !!(req.session as any)?.adminAuth;

    if (isAuthenticated) {
      res.json({ authenticated: true });
    } else {
      res.status(401).json({ authenticated: false });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err: any) => {
      if (err) return res.status(500).json({ error: "Error al cerrar sesión" });
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });

  app.get("/api/admin/me", (req, res) => {
    const isAuthenticated = !!(req.session as any).adminAuth;
    if (isAuthenticated) res.json({ authenticated: true });
    else res.status(401).json({ authenticated: false });
  });

  // ==================== PROJECTS (PUBLIC) ====================
  app.get("/api/projects/list", (_req, res) => {
    try {
      const projects = readProjects();
      res.json(projects);
    } catch {
      res.status(500).json({ error: "Error al leer proyectos" });
    }
  });

  app.get("/api/projects/:id", (req, res) => {
    try {
      const projects = readProjects();
      const project = projects.find(
        (p) => String(p.id) === String(req.params.id),
      );
      if (!project)
        return res.status(404).json({ error: "Proyecto no encontrado" });
      res.json(project);
    } catch {
      res.status(500).json({ error: "Error al leer proyecto" });
    }
  });

  // ==================== PROJECTS (ADMIN) ====================
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
        const body: any = req.body;

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
        if (!validation.success)
          return res.status(400).json({ error: validation.error.errors });

        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };

        const newProject: Project = {
          id: generateId(),
          ...validation.data,
          maps: validation.data.maps || {},
          masterPlanFiles:
            files?.masterPlanFiles?.map((f) => `/uploads/${f.filename}`) || [],
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
    },
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
        const index = projects.findIndex(
          (p) => String(p.id) === String(req.params.id),
        );
        if (index === -1)
          return res.status(404).json({ error: "Proyecto no encontrado" });

        const body: any = req.body;

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

        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };
        const newMasterPlan =
          files?.masterPlanFiles?.map((f) => `/uploads/${f.filename}`) || [];
        const newImagenes =
          files?.imagenes?.map((f) => `/uploads/${f.filename}`) || [];
        const newVideos =
          files?.videos?.map((f) => `/uploads/${f.filename}`) || [];

        const oldProject = projects[index];

        const filesToDelete = [
          ...(oldProject.masterPlanFiles || []).filter(
            (f) => !existingMasterPlan.includes(f),
          ),
          ...(oldProject.imagenes || []).filter(
            (f) => !existingImagenes.includes(f),
          ),
          ...(oldProject.videos || []).filter(
            (f) => !existingVideos.includes(f),
          ),
        ];

        filesToDelete.forEach((filePath) => {
          const fullPath = publicFileFullPath(filePath);
          if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
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
    },
  );

  app.delete("/api/projects/delete/:id", requireAdmin, (req, res) => {
    try {
      const projects = readProjects();
      const index = projects.findIndex(
        (p) => String(p.id) === String(req.params.id),
      );
      if (index === -1)
        return res.status(404).json({ error: "Proyecto no encontrado" });

      const project = projects[index];

      const allFiles = [
        ...(project.masterPlanFiles || []),
        ...(project.imagenes || []),
        ...(project.videos || []),
      ];
      allFiles.forEach((filePath) => {
        const fullPath = publicFileFullPath(filePath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });

      projects.splice(index, 1);
      writeProjects(projects);

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ error: "Error al eliminar proyecto" });
    }
  });

  // ==================== BLOG (PUBLIC) ====================
  app.get("/api/blog/list", (_req, res) => {
    try {
      const posts = readBlogPosts();
      res.json(posts);
    } catch {
      res.status(500).json({ error: "Error al leer posts" });
    }
  });

  app.get("/api/blog/:id", (req, res) => {
    try {
      const posts = readBlogPosts();
      const post = posts.find((p) => String(p.id) === String(req.params.id));
      if (!post) return res.status(404).json({ error: "Post no encontrado" });
      res.json(post);
    } catch {
      res.status(500).json({ error: "Error al leer post" });
    }
  });

  // ==================== BLOG (ADMIN) ====================
  app.post(
    "/api/blog/create",
    requireAdmin,
    upload.array("imagenes", 10),
    (req, res) => {
      try {
        const body: any = req.body;

        // ✅ Ahora sí: BlogAdmin manda FormData normal (no "data" JSON)
        const normalized = {
          titulo: body.titulo,
          subtitulo: body.subtitulo || "",
          contenido: body.contenido,
          fecha: body.fecha || new Date().toISOString().split("T")[0],
        };

        const validation = insertBlogPostSchema.safeParse(normalized);
        if (!validation.success)
          return res.status(400).json({ error: validation.error.errors });

        const files = (req.files || []) as Express.Multer.File[];
        const imagenes = files.map((f) => `/uploads/${f.filename}`);

        const posts = readBlogPosts();
        const newPost: BlogPost = {
          id: generateId(),
          titulo: validation.data.titulo,
          subtitulo: (validation.data as any).subtitulo || "",
          contenido: validation.data.contenido,
          fecha:
            (validation.data as any).fecha ||
            new Date().toISOString().split("T")[0],
          imagenes,
          updatedAt: new Date().toISOString(),
        } as any;

        posts.unshift(newPost);
        writeBlogPosts(posts);

        res.status(201).json(newPost);
      } catch (error) {
        console.error("Error creating blog post:", error);
        res.status(500).json({ error: "Error al crear post" });
      }
    },
  );

  app.put(
    "/api/blog/update/:id",
    requireAdmin,
    upload.array("imagenes", 10),
    (req, res) => {
      try {
        const posts = readBlogPosts();
        const index = posts.findIndex(
          (p) => String(p.id) === String(req.params.id),
        );
        if (index === -1)
          return res.status(404).json({ error: "Post no encontrado" });

        const body: any = req.body;
        const oldPost = posts[index];

        // existingImagenes viene como JSON string desde BlogAdmin
        let existingImagenes: string[] = oldPost.imagenes || [];
        if (typeof body.existingImagenes === "string") {
          try {
            existingImagenes = JSON.parse(body.existingImagenes);
          } catch {
            existingImagenes = oldPost.imagenes || [];
          }
        } else if (Array.isArray(body.existingImagenes)) {
          existingImagenes = body.existingImagenes;
        }

        const files = (req.files || []) as Express.Multer.File[];
        const newImagenes = files.map((f) => `/uploads/${f.filename}`);

        // borrar imágenes quitadas
        const removed = (oldPost.imagenes || []).filter(
          (f) => !existingImagenes.includes(f),
        );
        removed.forEach((filePath) => {
          const fullPath = publicFileFullPath(filePath);
          if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
        });

        const updatedPost: BlogPost = {
          ...oldPost,
          titulo: body.titulo ?? oldPost.titulo,
          subtitulo: body.subtitulo ?? oldPost.subtitulo,
          contenido: body.contenido ?? oldPost.contenido,
          fecha: body.fecha ?? oldPost.fecha,
          imagenes: [...existingImagenes, ...newImagenes].map(toPublicUrl),
          updatedAt: new Date().toISOString(),
        } as any;

        posts[index] = updatedPost;
        writeBlogPosts(posts);

        res.json(updatedPost);
      } catch (error) {
        console.error("Error updating blog post:", error);
        res.status(500).json({ error: "Error al actualizar post" });
      }
    },
  );

  app.delete("/api/blog/delete/:id", requireAdmin, (req, res) => {
    try {
      const posts = readBlogPosts();
      const index = posts.findIndex(
        (p) => String(p.id) === String(req.params.id),
      );
      if (index === -1)
        return res.status(404).json({ error: "Post no encontrado" });

      const post = posts[index];

      (post.imagenes || []).forEach((filePath) => {
        const fullPath = publicFileFullPath(filePath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });

      posts.splice(index, 1);
      writeBlogPosts(posts);

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ error: "Error al eliminar post" });
    }
  });

  // ==================== TESTIMONIALS ====================
  app.get("/api/testimonials/list", (_req, res) => {
    try {
      const testimonials = readTestimonials();
      const approved = testimonials.filter((t: any) => t.aprobado);
      res.json(approved);
    } catch {
      res.status(500).json({ error: "Error al leer testimonios" });
    }
  });

  app.get("/api/testimonials/list-admin", requireAdmin, (_req, res) => {
    try {
      const testimonials = readTestimonials();
      res.json(testimonials);
    } catch {
      res.status(500).json({ error: "Error al leer testimonios" });
    }
  });

  app.post(
    "/api/testimonials/create",
    requireAdmin,
    upload.single("imagen"),
    (req, res) => {
      try {
        const body: any = req.body;

        const validation = insertTestimonialSchema.safeParse({
          autor: body.autor,
          rol: body.rol || "",
          contenido: body.contenido,
          aprobado: body.aprobado === "true" || body.aprobado === true,
        });

        if (!validation.success)
          return res.status(400).json({ error: validation.error.errors });

        const file = req.file;
        const imagen = file ? `/uploads/${file.filename}` : "";

        const testimonials = readTestimonials();
        const newTestimonial: Testimonial = {
          id: generateId(),
          autor: validation.data.autor,
          rol: (validation.data as any).rol || "",
          contenido: validation.data.contenido,
          imagen,
          fecha: new Date().toISOString().split("T")[0],
          aprobado: (validation.data as any).aprobado ?? false,
          updatedAt: new Date().toISOString(),
        } as any;

        testimonials.unshift(newTestimonial);
        writeTestimonials(testimonials);

        res.status(201).json(newTestimonial);
      } catch (error) {
        console.error("Error creating testimonial:", error);
        res.status(500).json({ error: "Error al crear testimonio" });
      }
    },
  );

  app.put(
    "/api/testimonials/update/:id",
    requireAdmin,
    upload.single("imagen"),
    (req, res) => {
      try {
        const testimonials = readTestimonials();
        const index = testimonials.findIndex(
          (t: any) => String(t.id) === String(req.params.id),
        );
        if (index === -1)
          return res.status(404).json({ error: "Testimonio no encontrado" });

        const body: any = req.body;
        const oldTestimonial: any = testimonials[index];
        const file = req.file;

        let imagen = oldTestimonial.imagen || "";
        if (file) {
          if (
            oldTestimonial.imagen &&
            String(oldTestimonial.imagen).startsWith("/uploads/")
          ) {
            const oldPath = publicFileFullPath(oldTestimonial.imagen);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
          }
          imagen = `/uploads/${file.filename}`;
        } else if (body.existingImagen) {
          imagen = body.existingImagen;
        }

        const updatedTestimonial: any = {
          ...oldTestimonial,
          autor: body.autor ?? oldTestimonial.autor,
          rol: body.rol ?? oldTestimonial.rol,
          contenido: body.contenido ?? oldTestimonial.contenido,
          imagen,
          aprobado: body.aprobado === "true" || body.aprobado === true,
          updatedAt: new Date().toISOString(),
        };

        testimonials[index] = updatedTestimonial;
        writeTestimonials(testimonials);

        res.json(updatedTestimonial);
      } catch (error) {
        console.error("Error updating testimonial:", error);
        res.status(500).json({ error: "Error al actualizar testimonio" });
      }
    },
  );

  app.delete("/api/testimonials/delete/:id", requireAdmin, (req, res) => {
    try {
      const testimonials = readTestimonials();
      const index = testimonials.findIndex(
        (t: any) => String(t.id) === String(req.params.id),
      );
      if (index === -1)
        return res.status(404).json({ error: "Testimonio no encontrado" });

      const testimonial: any = testimonials[index];

      if (
        testimonial.imagen &&
        String(testimonial.imagen).startsWith("/uploads/")
      ) {
        const fullPath = publicFileFullPath(testimonial.imagen);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }

      testimonials.splice(index, 1);
      writeTestimonials(testimonials);

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ error: "Error al eliminar testimonio" });
    }
  });

  // ==================== ANALYTICS ====================
  app.post("/api/analytics/track", (req, res) => {
    try {
      const { page, projectId, blogId, source, seconds } = req.body;
      const analytics = readAnalytics();
      analytics.pageViews.push({
        page: page || "/",
        projectId: projectId || null,
        blogId: blogId || null,
        source: source || "direct",
        seconds: Math.max(1, seconds || 1),
        timestamp: new Date().toISOString(),
      });
      if (analytics.pageViews.length > 10000) {
        analytics.pageViews = analytics.pageViews.slice(-10000);
      }
      writeAnalytics(analytics);
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Error" });
    }
  });

  app.get("/api/analytics/summary", requireAdmin, (_req, res) => {
    try {
      const analytics = readAnalytics();
      const views = analytics.pageViews;

      const summary = {
        totalViews: views.length,
        totalSeconds: views.reduce((acc, v) => acc + v.seconds, 0),
        avgSecondsPerView:
          views.length > 0
            ? views.reduce((acc, v) => acc + v.seconds, 0) / views.length
            : 0,
        byPage: {} as Record<string, { views: number; seconds: number }>,
        byProject: {} as Record<string, { views: number; seconds: number }>,
        bySource: {} as Record<string, number>,
        byDay: {} as Record<string, { views: number; seconds: number }>,
      };

      views.forEach((v) => {
        if (!summary.byPage[v.page])
          summary.byPage[v.page] = { views: 0, seconds: 0 };
        summary.byPage[v.page].views++;
        summary.byPage[v.page].seconds += v.seconds;

        if (v.projectId) {
          if (!summary.byProject[v.projectId])
            summary.byProject[v.projectId] = { views: 0, seconds: 0 };
          summary.byProject[v.projectId].views++;
          summary.byProject[v.projectId].seconds += v.seconds;
        }

        summary.bySource[v.source] = (summary.bySource[v.source] || 0) + 1;

        const day = v.timestamp.split("T")[0];
        if (!summary.byDay[day]) summary.byDay[day] = { views: 0, seconds: 0 };
        summary.byDay[day].views++;
        summary.byDay[day].seconds += v.seconds;
      });

      res.json(summary);
    } catch {
      res.status(500).json({ error: "Error" });
    }
  });

  app.get("/api/analytics/summary-filtered", requireAdmin, (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const cutoffStr = cutoffDate.toISOString();

      const analytics = readAnalytics();
      const views = analytics.pageViews.filter((v) => v.timestamp >= cutoffStr);
      const projects = readProjects();

      const uniqueVisitors = new Set(
        views.map((v) => `${v.source}-${v.timestamp.split("T")[0]}`),
      ).size;

      const summary = {
        totalViews: views.length,
        uniqueVisitors,
        totalSeconds: views.reduce((acc, v) => acc + v.seconds, 0),
        avgSecondsPerView:
          views.length > 0
            ? views.reduce((acc, v) => acc + v.seconds, 0) / views.length
            : 0,
        byPage: {} as Record<string, { views: number; seconds: number }>,
        byProject: {} as Record<
          string,
          { views: number; seconds: number; name?: string }
        >,
        bySource: {} as Record<string, number>,
        byDay: {} as Record<string, { views: number; seconds: number }>,
      };

      views.forEach((v) => {
        if (!summary.byPage[v.page])
          summary.byPage[v.page] = { views: 0, seconds: 0 };
        summary.byPage[v.page].views++;
        summary.byPage[v.page].seconds += v.seconds;

        if (v.projectId) {
          if (!summary.byProject[v.projectId]) {
            const proj = projects.find(
              (p) => String(p.id) === String(v.projectId),
            );
            summary.byProject[v.projectId] = {
              views: 0,
              seconds: 0,
              name: proj?.nombre,
            };
          }
          summary.byProject[v.projectId].views++;
          summary.byProject[v.projectId].seconds += v.seconds;
        }

        summary.bySource[v.source] = (summary.bySource[v.source] || 0) + 1;

        const day = v.timestamp.split("T")[0];
        if (!summary.byDay[day]) summary.byDay[day] = { views: 0, seconds: 0 };
        summary.byDay[day].views++;
        summary.byDay[day].seconds += v.seconds;
      });

      res.json(summary);
    } catch {
      res.status(500).json({ error: "Error" });
    }
  });

  // ==================== LEADS ====================
  app.post("/api/leads/create", (req, res) => {
    try {
      const result = insertLeadSchema.safeParse(req.body);
      if (!result.success)
        return res.status(400).json({ error: result.error.errors[0].message });

      const leads = readLeads();
      const newLead: Lead = {
        id: generateId(),
        ...result.data,
        telefono: (result.data as any).telefono || "",
        mensaje: (result.data as any).mensaje || "",
        proyectoInteres: (result.data as any).proyectoInteres || "",
        fuente: (result.data as any).fuente || "web",
        estado: "nuevo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any;

      leads.push(newLead);
      writeLeads(leads);
      res.json(newLead);
    } catch {
      res.status(500).json({ error: "Error al crear lead" });
    }
  });

  app.get("/api/leads/list", requireAdmin, (_req, res) => {
    try {
      const leads = readLeads();
      res.json(
        leads.sort((a: any, b: any) =>
          String(b.createdAt).localeCompare(String(a.createdAt)),
        ),
      );
    } catch {
      res.status(500).json({ error: "Error" });
    }
  });

  app.put("/api/leads/update/:id", requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const { estado } = req.body;
      const leads: any[] = readLeads() as any;
      const idx = leads.findIndex((l) => String(l.id) === String(id));
      if (idx === -1)
        return res.status(404).json({ error: "Lead no encontrado" });
      leads[idx].estado = estado;
      leads[idx].updatedAt = new Date().toISOString();
      writeLeads(leads as any);
      res.json(leads[idx]);
    } catch {
      res.status(500).json({ error: "Error" });
    }
  });

  app.delete("/api/leads/delete/:id", requireAdmin, (req, res) => {
    try {
      const { id } = req.params;
      const leads: any[] = readLeads() as any;
      const filtered = leads.filter((l) => String(l.id) !== String(id));
      writeLeads(filtered as any);
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Error" });
    }
  });

  app.get("/api/leads/count", requireAdmin, (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      const cutoffStr = cutoffDate.toISOString();

      const leads: any[] = readLeads() as any;
      const filtered = leads.filter((l) => String(l.createdAt) >= cutoffStr);
      res.json({
        total: filtered.length,
        nuevos: filtered.filter((l) => l.estado === "nuevo").length,
      });
    } catch {
      res.status(500).json({ error: "Error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
