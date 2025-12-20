import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  LogOut,
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  Loader2,
  Eye,
  Clock,
  Users,
  TrendingUp,
  BarChart3,
  FileText,
  MessageSquare,
  Check,
  XCircle,
  Moon,
  Sun,
} from "lucide-react";
import {
  SiFacebook,
  SiInstagram,
  SiTiktok,
  SiGoogle,
  SiYoutube,
  SiX,
} from "react-icons/si";
import type { Project, BlogPost, Testimonial, Lead } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function useTheme() {
  const [theme, setThemeState] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (
        (localStorage.getItem("admin-theme") as "light" | "dark") || "dark"
      );
    }
    return "dark";
  });

  const setTheme = (newTheme: "light" | "dark") => {
    setThemeState(newTheme);
    localStorage.setItem("admin-theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // ✅ FIX: antes estaba con [] y no reaccionaba al toggle
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return { theme, setTheme };
}

interface AdminDashboardProps {
  onLogoutSuccess: () => void;
}

interface AnalyticsSummary {
  totalViews: number;
  totalSeconds: number;
  avgSecondsPerView: number;
  uniqueVisitors?: number;
  byPage: Record<string, { views: number; seconds: number }>;
  byProject: Record<string, { views: number; seconds: number; name?: string }>;
  bySource: Record<string, number>;
  byDay: Record<string, { views: number; seconds: number }>;
}

const sourceIcons: Record<string, JSX.Element> = {
  facebook: <SiFacebook className="w-4 h-4 text-blue-600" />,
  instagram: <SiInstagram className="w-4 h-4 text-pink-500" />,
  tiktok: <SiTiktok className="w-4 h-4" />,
  google: <SiGoogle className="w-4 h-4 text-red-500" />,
  youtube: <SiYoutube className="w-4 h-4 text-red-600" />,
  twitter: <SiX className="w-4 h-4" />,
};

function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}m ${secs}s`;
}

type ProjectForm = Omit<
  Project,
  "id" | "updatedAt" | "masterPlanFiles" | "imagenes" | "videos"
> & {
  existingMasterPlanFiles: string[];
  existingImagenes: string[];
  existingVideos: string[];
};

const emptyProjectForm: ProjectForm = {
  nombre: "",
  tipo: "Proyecto de terceros",
  etapa: "Preventa",
  ubicacionTexto: "",
  descripcion: "",
  contenidoLargo: "",
  maps: { lat: undefined, lng: undefined, placeUrl: "" },
  linkLotes: "",
  caracteristicas: [],
  servicios: [],
  amenidades: [],
  superficie: "",
  lotes: "",
  existingMasterPlanFiles: [],
  existingImagenes: [],
  existingVideos: [],
};

type BlogForm = {
  titulo: string;
  subtitulo: string;
  contenido: string;
  fecha: string;
  existingImagenes: string[];
};

const emptyBlogForm: BlogForm = {
  titulo: "",
  subtitulo: "",
  contenido: "",
  fecha: new Date().toISOString().split("T")[0],
  existingImagenes: [],
};

type TestimonialForm = {
  autor: string;
  rol: string;
  contenido: string;
  aprobado: boolean;
  existingImagen: string;
};

const emptyTestimonialForm: TestimonialForm = {
  autor: "",
  rol: "",
  contenido: "",
  aprobado: false,
  existingImagen: "",
};

export default function AdminDashboard({
  onLogoutSuccess,
}: AdminDashboardProps) {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const [analyticsData, setAnalyticsData] = useState<AnalyticsSummary | null>(
    null,
  );
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<number>(30);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsCount, setLeadsCount] = useState<{
    total: number;
    nuevos: number;
  }>({ total: 0, nuevos: 0 });

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectForm>(emptyProjectForm);
  const [newMasterPlan, setNewMasterPlan] = useState<FileList | null>(null);
  const [newProjectImages, setNewProjectImages] = useState<FileList | null>(
    null,
  );
  const [newProjectVideos, setNewProjectVideos] = useState<FileList | null>(
    null,
  );
  const [caracteristicasText, setCaracteristicasText] = useState("");
  const [serviciosText, setServiciosText] = useState("");
  const [amenidadesText, setAmenidadesText] = useState("");
  const [projectSubmitting, setProjectSubmitting] = useState(false);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogForm, setBlogForm] = useState<BlogForm>(emptyBlogForm);
  const [newBlogImages, setNewBlogImages] = useState<FileList | null>(null);
  const [blogSubmitting, setBlogSubmitting] = useState(false);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<
    string | null
  >(null);
  const [testimonialForm, setTestimonialForm] =
    useState<TestimonialForm>(emptyTestimonialForm);
  const [newTestimonialImage, setNewTestimonialImage] = useState<File | null>(
    null,
  );
  const [testimonialSubmitting, setTestimonialSubmitting] = useState(false);

  useEffect(() => {
    loadAnalyticsFiltered(dateRange);
    loadLeads();
    loadLeadsCount(dateRange);
    loadProjects();
    loadPosts();
    loadTestimonials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadAnalyticsFiltered(dateRange);
    loadLeadsCount(dateRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
      toast({
        title: "Sesión cerrada",
        description: "Has salido correctamente",
      });
      onLogoutSuccess();
    } catch {
      toast({
        title: "Error",
        description: "Error al cerrar sesión",
        variant: "destructive",
      });
    }
  };

  const loadAnalyticsFiltered = async (days: number) => {
    setAnalyticsLoading(true);
    try {
      const response = await fetch(
        `/api/analytics/summary-filtered?days=${days}`,
        {
          credentials: "include",
          cache: "no-store",
          headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
        },
      );
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch {
      console.error("Error loading analytics");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const loadLeads = async () => {
    try {
      const response = await fetch("/api/leads/list", {
        credentials: "include",
        cache: "no-store",
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch {
      console.error("Error loading leads");
    }
  };

  const loadLeadsCount = async (days: number) => {
    try {
      const response = await fetch(`/api/leads/count?days=${days}`, {
        credentials: "include",
        cache: "no-store",
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });
      if (response.ok) {
        const data = await response.json();
        setLeadsCount(data);
      }
    } catch {
      console.error("Error loading leads count");
    }
  };

  const handleUpdateLeadStatus = async (
    leadId: string,
    newStatus: Lead["estado"],
  ) => {
    try {
      const response = await fetch(`/api/leads/update/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: newStatus }),
        credentials: "include",
        cache: "no-store",
      });
      if (response.ok) {
        toast({ title: "Estado actualizado" });
        loadLeads();
        loadLeadsCount(dateRange);
      }
    } catch {
      toast({
        title: "Error",
        description: "Error al actualizar estado",
        variant: "destructive",
      });
    }
  };

  const getLeadStatusColor = (estado: Lead["estado"]) => {
    switch (estado) {
      case "nuevo":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "contactado":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "convertido":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "descartado":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const loadProjects = async () => {
    setProjectsLoading(true);
    try {
      const response = await fetch("/api/projects/list", {
        credentials: "include",
        cache: "no-store",
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch {
      toast({
        title: "Error",
        description: "Error al cargar proyectos",
        variant: "destructive",
      });
    } finally {
      setProjectsLoading(false);
    }
  };

  const loadPosts = async () => {
    setPostsLoading(true);
    try {
      const response = await fetch("/api/blog/list", {
        credentials: "include",
        cache: "no-store",
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch {
      toast({
        title: "Error",
        description: "Error al cargar posts",
        variant: "destructive",
      });
    } finally {
      setPostsLoading(false);
    }
  };

  const loadTestimonials = async () => {
    setTestimonialsLoading(true);
    try {
      const response = await fetch("/api/testimonials/list-admin", {
        credentials: "include",
        cache: "no-store",
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch {
      toast({
        title: "Error",
        description: "Error al cargar testimonios",
        variant: "destructive",
      });
    } finally {
      setTestimonialsLoading(false);
    }
  };

  const openCreateProject = () => {
    setProjectForm(emptyProjectForm);
    setCaracteristicasText("");
    setServiciosText("");
    setAmenidadesText("");
    setNewMasterPlan(null);
    setNewProjectImages(null);
    setNewProjectVideos(null);
    setEditingProjectId(null);
    setShowProjectForm(true);
  };

  const openEditProject = (project: Project) => {
    setProjectForm({
      nombre: project.nombre,
      tipo: project.tipo,
      etapa: project.etapa,
      ubicacionTexto: project.ubicacionTexto,
      descripcion: project.descripcion,
      contenidoLargo: project.contenidoLargo,
      maps: project.maps || {},
      linkLotes: project.linkLotes,
      caracteristicas: project.caracteristicas,
      servicios: project.servicios,
      amenidades: project.amenidades,
      superficie: project.superficie,
      lotes: project.lotes,
      existingMasterPlanFiles: project.masterPlanFiles,
      existingImagenes: project.imagenes,
      existingVideos: project.videos,
    });
    setCaracteristicasText(project.caracteristicas.join("\n"));
    setServiciosText(project.servicios.join("\n"));
    setAmenidadesText(project.amenidades.join("\n"));
    setNewMasterPlan(null);
    setNewProjectImages(null);
    setNewProjectVideos(null);
    setEditingProjectId(project.id);
    setShowProjectForm(true);
  };

  const closeProjectForm = () => {
    setShowProjectForm(false);
    setEditingProjectId(null);
  };

  const removeProjectFile = (
    type: "masterPlan" | "imagenes" | "videos",
    filePath: string,
  ) => {
    if (type === "masterPlan") {
      setProjectForm((prev) => ({
        ...prev,
        existingMasterPlanFiles: prev.existingMasterPlanFiles.filter(
          (f) => f !== filePath,
        ),
      }));
    } else if (type === "imagenes") {
      setProjectForm((prev) => ({
        ...prev,
        existingImagenes: prev.existingImagenes.filter((f) => f !== filePath),
      }));
    } else {
      setProjectForm((prev) => ({
        ...prev,
        existingVideos: prev.existingVideos.filter((f) => f !== filePath),
      }));
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("nombre", projectForm.nombre);
      formData.append("tipo", projectForm.tipo);
      formData.append("etapa", projectForm.etapa);
      formData.append("ubicacionTexto", projectForm.ubicacionTexto);
      formData.append("descripcion", projectForm.descripcion);
      formData.append("contenidoLargo", projectForm.contenidoLargo);
      formData.append(
        "maps",
        JSON.stringify({
          lat: projectForm.maps.lat || undefined,
          lng: projectForm.maps.lng || undefined,
          placeUrl: projectForm.maps.placeUrl || "",
        }),
      );
      formData.append("linkLotes", projectForm.linkLotes);
      formData.append(
        "caracteristicas",
        JSON.stringify(caracteristicasText.split("\n").filter(Boolean)),
      );
      formData.append(
        "servicios",
        JSON.stringify(serviciosText.split("\n").filter(Boolean)),
      );
      formData.append(
        "amenidades",
        JSON.stringify(amenidadesText.split("\n").filter(Boolean)),
      );
      formData.append("superficie", projectForm.superficie);
      formData.append("lotes", projectForm.lotes);
      if (editingProjectId) {
        formData.append(
          "existingMasterPlanFiles",
          JSON.stringify(projectForm.existingMasterPlanFiles),
        );
        formData.append(
          "existingImagenes",
          JSON.stringify(projectForm.existingImagenes),
        );
        formData.append(
          "existingVideos",
          JSON.stringify(projectForm.existingVideos),
        );
      }
      if (newMasterPlan)
        Array.from(newMasterPlan).forEach((file) =>
          formData.append("masterPlanFiles", file),
        );
      if (newProjectImages)
        Array.from(newProjectImages).forEach((file) =>
          formData.append("imagenes", file),
        );
      if (newProjectVideos)
        Array.from(newProjectVideos).forEach((file) =>
          formData.append("videos", file),
        );

      const url = editingProjectId
        ? `/api/projects/update/${editingProjectId}`
        : "/api/projects/create";
      const response = await fetch(url, {
        method: editingProjectId ? "PUT" : "POST",
        body: formData,
        credentials: "include",
        cache: "no-store",
      });

      if (response.ok) {
        toast({
          title: "Guardado",
          description: editingProjectId
            ? "Proyecto actualizado"
            : "Proyecto creado",
        });
        closeProjectForm();
        loadProjects();
      } else {
        const error = await response.json().catch(() => null);
        toast({
          title: "Error",
          description: error?.error || "Error al guardar",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      });
    } finally {
      setProjectSubmitting(false);
    }
  };

  const handleProjectDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar este proyecto?")) return;
    try {
      const response = await fetch(`/api/projects/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
        cache: "no-store",
      });
      if (response.ok) {
        toast({
          title: "Eliminado",
          description: "Proyecto eliminado correctamente",
        });
        loadProjects();
      } else {
        toast({
          title: "Error",
          description: "Error al eliminar",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      });
    }
  };

  const openCreateBlog = () => {
    setBlogForm(emptyBlogForm);
    setNewBlogImages(null);
    setEditingBlogId(null);
    setShowBlogForm(true);
  };

  const openEditBlog = (post: BlogPost) => {
    setBlogForm({
      titulo: post.titulo,
      subtitulo: post.subtitulo,
      contenido: post.contenido,
      fecha: post.fecha,
      existingImagenes: post.imagenes || [],
    });
    setNewBlogImages(null);
    setEditingBlogId(post.id);
    setShowBlogForm(true);
  };

  const closeBlogForm = () => {
    setShowBlogForm(false);
    setEditingBlogId(null);
  };

  const removeBlogImage = (imagePath: string) => {
    setBlogForm((prev) => ({
      ...prev,
      existingImagenes: prev.existingImagenes.filter((f) => f !== imagePath),
    }));
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("titulo", blogForm.titulo);
      formData.append("subtitulo", blogForm.subtitulo);
      formData.append("contenido", blogForm.contenido);
      formData.append("fecha", blogForm.fecha);
      if (editingBlogId)
        formData.append(
          "existingImagenes",
          JSON.stringify(blogForm.existingImagenes),
        );
      if (newBlogImages)
        Array.from(newBlogImages).forEach((file) =>
          formData.append("imagenes", file),
        );

      const url = editingBlogId
        ? `/api/blog/update/${editingBlogId}`
        : "/api/blog/create";
      const response = await fetch(url, {
        method: editingBlogId ? "PUT" : "POST",
        body: formData,
        credentials: "include",
        cache: "no-store",
      });

      if (response.ok) {
        toast({
          title: "Guardado",
          description: editingBlogId ? "Post actualizado" : "Post creado",
        });
        closeBlogForm();
        loadPosts();
      } else {
        const error = await response.json().catch(() => null);
        toast({
          title: "Error",
          description: error?.error || "Error al guardar",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      });
    } finally {
      setBlogSubmitting(false);
    }
  };

  const handleBlogDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar este post?")) return;
    try {
      const response = await fetch(`/api/blog/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
        cache: "no-store",
      });
      if (response.ok) {
        toast({
          title: "Eliminado",
          description: "Post eliminado correctamente",
        });
        loadPosts();
      } else {
        toast({
          title: "Error",
          description: "Error al eliminar",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      });
    }
  };

  const openCreateTestimonial = () => {
    setTestimonialForm(emptyTestimonialForm);
    setNewTestimonialImage(null);
    setEditingTestimonialId(null);
    setShowTestimonialForm(true);
  };

  const openEditTestimonial = (testimonial: Testimonial) => {
    setTestimonialForm({
      autor: testimonial.autor,
      rol: testimonial.rol,
      contenido: testimonial.contenido,
      aprobado: testimonial.aprobado,
      existingImagen: testimonial.imagen || "",
    });
    setNewTestimonialImage(null);
    setEditingTestimonialId(testimonial.id);
    setShowTestimonialForm(true);
  };

  const closeTestimonialForm = () => {
    setShowTestimonialForm(false);
    setEditingTestimonialId(null);
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestimonialSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("autor", testimonialForm.autor);
      formData.append("rol", testimonialForm.rol);
      formData.append("contenido", testimonialForm.contenido);
      formData.append("aprobado", String(testimonialForm.aprobado));
      if (editingTestimonialId && testimonialForm.existingImagen)
        formData.append("existingImagen", testimonialForm.existingImagen);
      if (newTestimonialImage) formData.append("imagen", newTestimonialImage);

      const url = editingTestimonialId
        ? `/api/testimonials/update/${editingTestimonialId}`
        : "/api/testimonials/create";
      const response = await fetch(url, {
        method: editingTestimonialId ? "PUT" : "POST",
        body: formData,
        credentials: "include",
        cache: "no-store",
      });

      if (response.ok) {
        toast({
          title: "Guardado",
          description: editingTestimonialId
            ? "Testimonio actualizado"
            : "Testimonio creado",
        });
        closeTestimonialForm();
        loadTestimonials();
      } else {
        const error = await response.json().catch(() => null);
        toast({
          title: "Error",
          description: error?.error || "Error al guardar",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      });
    } finally {
      setTestimonialSubmitting(false);
    }
  };

  const handleToggleApproval = async (testimonial: Testimonial) => {
    try {
      const formData = new FormData();
      formData.append("autor", testimonial.autor);
      formData.append("rol", testimonial.rol);
      formData.append("contenido", testimonial.contenido);
      formData.append("aprobado", String(!testimonial.aprobado));
      formData.append("existingImagen", testimonial.imagen);

      const response = await fetch(
        `/api/testimonials/update/${testimonial.id}`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
          cache: "no-store",
        },
      );

      if (response.ok) {
        toast({ title: testimonial.aprobado ? "Desaprobado" : "Aprobado" });
        loadTestimonials();
      }
    } catch {
      toast({
        title: "Error",
        description: "Error al cambiar estado",
        variant: "destructive",
      });
    }
  };

  const handleTestimonialDelete = async (id: string) => {
    if (!confirm("¿Seguro que quieres eliminar este testimonio?")) return;
    try {
      const response = await fetch(`/api/testimonials/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
        cache: "no-store",
      });
      if (response.ok) {
        toast({
          title: "Eliminado",
          description: "Testimonio eliminado correctamente",
        });
        loadTestimonials();
      } else {
        toast({
          title: "Error",
          description: "Error al eliminar",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Error de conexión",
        variant: "destructive",
      });
    }
  };

  const sortedProjects = analyticsData
    ? Object.entries(analyticsData.byProject)
        .sort(([, a], [, b]) => b.views - a.views)
        .slice(0, 10)
    : [];
  const sortedSources = analyticsData
    ? Object.entries(analyticsData.bySource).sort(([, a], [, b]) => b - a)
    : [];
  const sortedPages = analyticsData
    ? Object.entries(analyticsData.byPage)
        .sort(([, a], [, b]) => b.views - a.views)
        .slice(0, 10)
    : [];
  const sortedDays = analyticsData
    ? Object.entries(analyticsData.byDay)
        .sort(([a], [b]) => b.localeCompare(a))
        .slice(0, 7)
    : [];

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/80">
        <div className="flex items-center justify-between gap-4 px-4 h-14">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              data-testid="link-back-site"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al sitio
            </a>
            <span className="hidden sm:block h-4 w-px bg-slate-700" />
            <span className="hidden sm:block font-semibold text-white">
              Panel de Administración
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-slate-400 hover:text-white"
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="gap-2 text-slate-400 hover:text-white"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <Tabs defaultValue="estadisticas" className="space-y-6">
          <TabsList className="w-full grid grid-cols-4 bg-slate-800/50 p-1 rounded-lg">
            <TabsTrigger
              value="estadisticas"
              className="gap-2 data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
              data-testid="tab-estadisticas"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Estadísticas</span>
            </TabsTrigger>
            <TabsTrigger
              value="proyectos"
              className="gap-2 data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
              data-testid="tab-proyectos"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Proyectos</span>
            </TabsTrigger>
            <TabsTrigger
              value="blog"
              className="gap-2 data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
              data-testid="tab-blog"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Blog</span>
            </TabsTrigger>
            <TabsTrigger
              value="testimonios"
              className="gap-2 data-[state=active]:bg-slate-700 data-[state=active]:text-white text-slate-400"
              data-testid="tab-testimonios"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Testimonios</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="estadisticas" className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Estadísticas</h2>
                <p className="text-sm text-slate-400">
                  Métricas de visitas y engagement
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select
                  value={String(dateRange)}
                  onValueChange={(val) => setDateRange(Number(val))}
                >
                  <SelectTrigger
                    className="w-32 bg-slate-800 border-slate-700 text-white"
                    data-testid="select-date-range"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="7" className="text-white">
                      7 días
                    </SelectItem>
                    <SelectItem value="30" className="text-white">
                      30 días
                    </SelectItem>
                    <SelectItem value="90" className="text-white">
                      90 días
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => {
                    loadAnalyticsFiltered(dateRange);
                    loadLeads();
                    loadLeadsCount(dateRange);
                  }}
                  className="border-slate-700 text-slate-300"
                  data-testid="button-refresh-analytics"
                >
                  Actualizar
                </Button>
              </div>
            </div>

            {analyticsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              </div>
            ) : !analyticsData ? (
              <div className="text-center py-12 text-slate-500">
                No hay datos de analytics disponibles.
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-5">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="p-3 bg-blue-500/20 rounded-lg">
                        <Users className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {analyticsData.uniqueVisitors || 0}
                        </p>
                        <p className="text-sm text-slate-400">
                          Visitantes únicos
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="p-3 bg-emerald-500/20 rounded-lg">
                        <Eye className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {analyticsData.totalViews}
                        </p>
                        <p className="text-sm text-slate-400">Páginas vistas</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="p-3 bg-purple-500/20 rounded-lg">
                        <Clock className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {formatTime(analyticsData.avgSecondsPerView)}
                        </p>
                        <p className="text-sm text-slate-400">
                          Tiempo promedio
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="p-3 bg-amber-500/20 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {leadsCount.total}
                        </p>
                        <p className="text-sm text-slate-400">Total leads</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="p-3 bg-cyan-500/20 rounded-lg">
                        <MessageSquare className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-white">
                          {leadsCount.nuevos}
                        </p>
                        <p className="text-sm text-slate-400">Leads nuevos</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">
                        Top Proyectos por Visitas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {sortedProjects.length > 0 ? (
                        <div className="space-y-3">
                          {sortedProjects.map(([projectId, data]) => (
                            <div
                              key={projectId}
                              className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-white">
                                  {data.name || `Proyecto ${projectId}`}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {formatTime(data.seconds / data.views)}{" "}
                                  promedio
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-emerald-400">
                                  {data.views}
                                </p>
                                <p className="text-xs text-slate-400">
                                  visitas
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-center py-4">
                          Sin datos de proyectos
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">
                        Fuentes de Tráfico
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {sortedSources.length > 0 ? (
                        <div className="space-y-3">
                          {sortedSources.map(([source, views]) => (
                            <div
                              key={source}
                              className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                {sourceIcons[source] || (
                                  <Users className="w-4 h-4 text-slate-400" />
                                )}
                                <span className="font-medium text-white capitalize">
                                  {source}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white">
                                  {views}
                                </span>
                                <span className="text-xs text-slate-400">
                                  (
                                  {Math.round(
                                    (views / analyticsData.totalViews) * 100,
                                  )}
                                  %)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-center py-4">
                          Sin datos de fuentes
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">
                        Páginas más visitadas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {sortedPages.length > 0 ? (
                        <div className="space-y-3">
                          {sortedPages.map(([page, data]) => (
                            <div
                              key={page}
                              className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                            >
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-white truncate">
                                  {page === "/" ? "Home" : page}
                                </p>
                                <p className="text-xs text-slate-400">
                                  {formatTime(data.seconds / data.views)}{" "}
                                  promedio
                                </p>
                              </div>
                              <div className="text-right ml-4">
                                <p className="font-bold text-emerald-400">
                                  {data.views}
                                </p>
                                <p className="text-xs text-slate-400">
                                  visitas
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-center py-4">
                          Sin datos de páginas
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-lg text-white">
                        Últimos 7 días
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {sortedDays.length > 0 ? (
                        <div className="space-y-3">
                          {sortedDays.map(([day, data]) => (
                            <div
                              key={day}
                              className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                            >
                              <span className="font-medium text-white">
                                {day}
                              </span>
                              <div className="flex items-center gap-4">
                                <span className="text-sm text-slate-400">
                                  {formatTime(data.seconds)}
                                </span>
                                <span className="font-bold text-emerald-400">
                                  {data.views} visitas
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-center py-4">
                          Sin datos recientes
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-slate-800/50 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-lg text-white flex items-center justify-between gap-4 flex-wrap">
                      <span>Últimos Leads</span>
                      <Badge
                        variant="outline"
                        className="text-slate-400 border-slate-600"
                      >
                        {leads.length} total
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {leads.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-slate-700">
                              <th className="text-left py-3 px-2 text-sm font-medium text-slate-400">
                                Nombre
                              </th>
                              <th className="text-left py-3 px-2 text-sm font-medium text-slate-400">
                                Email
                              </th>
                              <th className="text-left py-3 px-2 text-sm font-medium text-slate-400 hidden md:table-cell">
                                Proyecto
                              </th>
                              <th className="text-left py-3 px-2 text-sm font-medium text-slate-400">
                                Estado
                              </th>
                              <th className="text-left py-3 px-2 text-sm font-medium text-slate-400 hidden sm:table-cell">
                                Fecha
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {leads.slice(0, 10).map((lead) => (
                              <tr
                                key={lead.id}
                                className="border-b border-slate-700/50"
                                data-testid={`row-lead-${lead.id}`}
                              >
                                <td className="py-3 px-2">
                                  <div>
                                    <p className="font-medium text-white">
                                      {lead.nombre}
                                    </p>
                                    <p className="text-xs text-slate-400 md:hidden">
                                      {lead.email}
                                    </p>
                                  </div>
                                </td>
                                <td className="py-3 px-2 text-sm text-slate-300 hidden md:table-cell">
                                  {lead.email}
                                </td>
                                <td className="py-3 px-2 text-sm text-slate-300 hidden md:table-cell">
                                  {lead.proyectoInteres || "-"}
                                </td>
                                <td className="py-3 px-2">
                                  <Select
                                    value={lead.estado}
                                    onValueChange={(val) =>
                                      handleUpdateLeadStatus(
                                        lead.id,
                                        val as Lead["estado"],
                                      )
                                    }
                                  >
                                    <SelectTrigger
                                      className={`w-28 h-8 text-xs border ${getLeadStatusColor(lead.estado)}`}
                                      data-testid={`select-lead-status-${lead.id}`}
                                    >
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                      <SelectItem
                                        value="nuevo"
                                        className="text-blue-400"
                                      >
                                        Nuevo
                                      </SelectItem>
                                      <SelectItem
                                        value="contactado"
                                        className="text-yellow-400"
                                      >
                                        Contactado
                                      </SelectItem>
                                      <SelectItem
                                        value="convertido"
                                        className="text-emerald-400"
                                      >
                                        Convertido
                                      </SelectItem>
                                      <SelectItem
                                        value="descartado"
                                        className="text-red-400"
                                      >
                                        Descartado
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </td>
                                <td className="py-3 px-2 text-sm text-slate-400 hidden sm:table-cell">
                                  {new Date(lead.createdAt).toLocaleDateString(
                                    "es-AR",
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-slate-500 text-center py-4">
                        No hay leads registrados
                      </p>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="proyectos" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Proyectos</h2>
                <p className="text-sm text-slate-400">
                  {projects.length} proyectos
                </p>
              </div>
              <Button
                onClick={openCreateProject}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                data-testid="button-create-project"
              >
                <Plus className="w-4 h-4" /> Nuevo Proyecto
              </Button>
            </div>

            {projectsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              </div>
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="bg-slate-800/50 border-slate-700"
                    data-testid={`card-admin-project-${project.id}`}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">
                          {project.nombre}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <span>{project.ubicacionTexto}</span>
                          <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                            {project.etapa}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditProject(project)}
                          className="text-slate-400 hover:text-white"
                          data-testid={`button-edit-project-${project.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleProjectDelete(project.id)}
                          className="text-red-400 hover:text-red-300"
                          data-testid={`button-delete-project-${project.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {projects.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    No hay proyectos. Crea el primero.
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="blog" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Blog</h2>
                <p className="text-sm text-slate-400">{posts.length} posts</p>
              </div>
              <Button
                onClick={openCreateBlog}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                data-testid="button-create-post"
              >
                <Plus className="w-4 h-4" /> Nuevo Post
              </Button>
            </div>

            {postsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              </div>
            ) : (
              <div className="grid gap-4">
                {posts.map((post) => (
                  <Card
                    key={post.id}
                    className="bg-slate-800/50 border-slate-700"
                    data-testid={`card-admin-blog-${post.id}`}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      {post.imagenes && post.imagenes[0] && (
                        <img
                          src={post.imagenes[0]}
                          alt={post.titulo}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white truncate">
                          {post.titulo}
                        </h3>
                        <p className="text-sm text-slate-400 truncate">
                          {post.subtitulo}
                        </p>
                        <p className="text-xs text-slate-500">{post.fecha}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditBlog(post)}
                          className="text-slate-400 hover:text-white"
                          data-testid={`button-edit-blog-${post.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleBlogDelete(post.id)}
                          className="text-red-400 hover:text-red-300"
                          data-testid={`button-delete-blog-${post.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {posts.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    No hay posts. Crea el primero.
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="testimonios" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Testimonios</h2>
                <p className="text-sm text-slate-400">
                  {testimonials.length} testimonios (
                  {testimonials.filter((t) => t.aprobado).length} aprobados)
                </p>
              </div>
              <Button
                onClick={openCreateTestimonial}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                data-testid="button-create-testimonial"
              >
                <Plus className="w-4 h-4" /> Nuevo Testimonio
              </Button>
            </div>

            {testimonialsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              </div>
            ) : (
              <div className="grid gap-4">
                {testimonials.map((testimonial) => (
                  <Card
                    key={testimonial.id}
                    className={`bg-slate-800/50 border-slate-700 ${!testimonial.aprobado ? "opacity-60" : ""}`}
                    data-testid={`card-admin-testimonial-${testimonial.id}`}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      {testimonial.imagen && (
                        <img
                          src={testimonial.imagen}
                          alt={testimonial.autor}
                          className="w-16 h-16 object-cover rounded-full"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">
                            {testimonial.autor}
                          </h3>
                          {testimonial.aprobado ? (
                            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-xs">
                              Aprobado
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-xs">
                              Pendiente
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-400">
                          {testimonial.rol}
                        </p>
                        <p className="text-xs text-slate-500 truncate mt-1">
                          "{testimonial.contenido}"
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleApproval(testimonial)}
                          title={
                            testimonial.aprobado ? "Desaprobar" : "Aprobar"
                          }
                          className="text-slate-400 hover:text-white"
                          data-testid={`button-toggle-testimonial-${testimonial.id}`}
                        >
                          {testimonial.aprobado ? (
                            <XCircle className="w-4 h-4 text-amber-400" />
                          ) : (
                            <Check className="w-4 h-4 text-emerald-400" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditTestimonial(testimonial)}
                          className="text-slate-400 hover:text-white"
                          data-testid={`button-edit-testimonial-${testimonial.id}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleTestimonialDelete(testimonial.id)
                          }
                          className="text-red-400 hover:text-red-300"
                          data-testid={`button-delete-testimonial-${testimonial.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {testimonials.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    No hay testimonios. Crea el primero.
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {showProjectForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto p-4">
          <Card className="w-full max-w-4xl my-8 bg-slate-900 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-slate-700">
              <CardTitle className="text-white">
                {editingProjectId ? "Editar Proyecto" : "Nuevo Proyecto"}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeProjectForm}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleProjectSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">
                      Nombre *
                    </label>
                    <Input
                      value={projectForm.nombre}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          nombre: e.target.value,
                        }))
                      }
                      required
                      className="bg-slate-800 border-slate-700 text-white"
                      data-testid="input-project-nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">
                      Tipo
                    </label>
                    <select
                      value={projectForm.tipo}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          tipo: e.target.value,
                        }))
                      }
                      className="w-full h-9 px-3 rounded-md border border-slate-700 bg-slate-800 text-white"
                      data-testid="select-project-tipo"
                    >
                      <option value="Proyecto propio">Proyecto propio</option>
                      <option value="Proyecto de terceros">
                        Proyecto de terceros
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">
                      Etapa *
                    </label>
                    <select
                      value={projectForm.etapa}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          etapa: e.target.value,
                        }))
                      }
                      className="w-full h-9 px-3 rounded-md border border-slate-700 bg-slate-800 text-white"
                      data-testid="select-project-etapa"
                    >
                      <option value="Preventa">Preventa</option>
                      <option value="En venta">En venta</option>
                      <option value="Próximamente">Próximamente</option>
                      <option value="Vendido">Vendido</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">
                      Ubicación *
                    </label>
                    <Input
                      value={projectForm.ubicacionTexto}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          ubicacionTexto: e.target.value,
                        }))
                      }
                      required
                      className="bg-slate-800 border-slate-700 text-white"
                      data-testid="input-project-ubicacion"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">
                      Superficie
                    </label>
                    <Input
                      value={projectForm.superficie}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          superficie: e.target.value,
                        }))
                      }
                      placeholder="ej: 63.000 m²"
                      className="bg-slate-800 border-slate-700 text-white"
                      data-testid="input-project-superficie"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">
                      Lotes
                    </label>
                    <Input
                      value={projectForm.lotes}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          lotes: e.target.value,
                        }))
                      }
                      placeholder="ej: 30 lotes en preventa"
                      className="bg-slate-800 border-slate-700 text-white"
                      data-testid="input-project-lotes"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-300">
                    Descripción corta *
                  </label>
                  <Textarea
                    value={projectForm.descripcion}
                    onChange={(e) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        descripcion: e.target.value,
                      }))
                    }
                    required
                    rows={2}
                    className="bg-slate-800 border-slate-700 text-white"
                    data-testid="textarea-project-descripcion"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-300">
                    Contenido largo
                  </label>
                  <Textarea
                    value={projectForm.contenidoLargo}
                    onChange={(e) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        contenidoLargo: e.target.value,
                      }))
                    }
                    rows={4}
                    className="bg-slate-800 border-slate-700 text-white"
                    data-testid="textarea-project-contenidolargo"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">
                      Latitud
                    </label>
                    <Input
                      type="number"
                      step="any"
                      value={projectForm.maps.lat ?? ""}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          maps: {
                            ...prev.maps,
                            lat: e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          },
                        }))
                      }
                      placeholder="-34.6857"
                      className="bg-slate-800 border-slate-700 text-white"
                      data-testid="input-project-lat"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">
                      Longitud
                    </label>
                    <Input
                      type="number"
                      step="any"
                      value={projectForm.maps.lng ?? ""}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          maps: {
                            ...prev.maps,
                            lng: e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          },
                        }))
                      }
                      placeholder="-58.7275"
                      className="bg-slate-800 border-slate-700 text-white"
                      data-testid="input-project-lng"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">
                      URL Google Maps
                    </label>
                    <Input
                      value={projectForm.maps.placeUrl ?? ""}
                      onChange={(e) =>
                        setProjectForm((prev) => ({
                          ...prev,
                          maps: { ...prev.maps, placeUrl: e.target.value },
                        }))
                      }
                      placeholder="https://maps.google.com/..."
                      className="bg-slate-800 border-slate-700 text-white"
                      data-testid="input-project-placeurl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-300">
                    Link de lotes disponibles
                  </label>
                  <Input
                    value={projectForm.linkLotes}
                    onChange={(e) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        linkLotes: e.target.value,
                      }))
                    }
                    placeholder="https://..."
                    className="bg-slate-800 border-slate-700 text-white"
                    data-testid="input-project-linklotes"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">
                      Características (una por línea)
                    </label>
                    <Textarea
                      value={caracteristicasText}
                      onChange={(e) => setCaracteristicasText(e.target.value)}
                      rows={4}
                      className="bg-slate-800 border-slate-700 text-white"
                      data-testid="textarea-project-caracteristicas"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">
                      Servicios (uno por línea)
                    </label>
                    <Textarea
                      value={serviciosText}
                      onChange={(e) => setServiciosText(e.target.value)}
                      rows={4}
                      className="bg-slate-800 border-slate-700 text-white"
                      data-testid="textarea-project-servicios"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">
                      Amenidades (una por línea)
                    </label>
                    <Textarea
                      value={amenidadesText}
                      onChange={(e) => setAmenidadesText(e.target.value)}
                      rows={4}
                      className="bg-slate-800 border-slate-700 text-white"
                      data-testid="textarea-project-amenidades"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300">
                      Master Plan
                    </label>
                    {projectForm.existingMasterPlanFiles.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {projectForm.existingMasterPlanFiles.map(
                          (file, idx) => (
                            <div key={idx} className="relative group">
                              <img
                                src={file}
                                alt="Master plan"
                                className="w-16 h-16 object-cover rounded border border-slate-700"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  removeProjectFile("masterPlan", file)
                                }
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-600 rounded-lg cursor-pointer hover:bg-slate-800">
                      <Upload className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-400">
                        {newMasterPlan
                          ? `${newMasterPlan.length} archivos`
                          : "Subir imágenes"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => setNewMasterPlan(e.target.files)}
                        data-testid="input-file-masterplan"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300">
                      Galería de imágenes
                    </label>
                    {projectForm.existingImagenes.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {projectForm.existingImagenes.map((file, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={file}
                              alt="Galería"
                              className="w-16 h-16 object-cover rounded border border-slate-700"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                removeProjectFile("imagenes", file)
                              }
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-600 rounded-lg cursor-pointer hover:bg-slate-800">
                      <Upload className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-400">
                        {newProjectImages
                          ? `${newProjectImages.length} archivos`
                          : "Subir imágenes"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => setNewProjectImages(e.target.files)}
                        data-testid="input-file-imagenes"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-300">
                      Videos
                    </label>
                    {projectForm.existingVideos.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {projectForm.existingVideos.map((file, idx) => (
                          <div
                            key={idx}
                            className="relative bg-slate-800 px-2 py-1 rounded text-xs text-slate-300"
                          >
                            {file.split("/").pop()}
                            <button
                              type="button"
                              onClick={() => removeProjectFile("videos", file)}
                              className="ml-2 text-red-400"
                            >
                              <X className="w-3 h-3 inline" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-600 rounded-lg cursor-pointer hover:bg-slate-800">
                      <Upload className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-400">
                        {newProjectVideos
                          ? `${newProjectVideos.length} archivos`
                          : "Subir videos"}
                      </span>
                      <input
                        type="file"
                        accept="video/*"
                        multiple
                        className="hidden"
                        onChange={(e) => setNewProjectVideos(e.target.files)}
                        data-testid="input-file-videos"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeProjectForm}
                    disabled={projectSubmitting}
                    className="border-slate-600 text-slate-300"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={projectSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    data-testid="button-submit-project"
                  >
                    {projectSubmitting && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingProjectId ? "Guardar cambios" : "Crear proyecto"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {showBlogForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto p-4">
          <Card className="w-full max-w-2xl my-8 bg-slate-900 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-slate-700">
              <CardTitle className="text-white">
                {editingBlogId ? "Editar Post" : "Nuevo Post"}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeBlogForm}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleBlogSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-300">
                    Título *
                  </label>
                  <Input
                    value={blogForm.titulo}
                    onChange={(e) =>
                      setBlogForm((prev) => ({
                        ...prev,
                        titulo: e.target.value,
                      }))
                    }
                    required
                    className="bg-slate-800 border-slate-700 text-white"
                    data-testid="input-blog-titulo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-300">
                    Subtítulo (resumen) *
                  </label>
                  <Textarea
                    value={blogForm.subtitulo}
                    onChange={(e) =>
                      setBlogForm((prev) => ({
                        ...prev,
                        subtitulo: e.target.value,
                      }))
                    }
                    required
                    rows={2}
                    className="bg-slate-800 border-slate-700 text-white"
                    data-testid="textarea-blog-subtitulo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-300">
                    Contenido *
                  </label>
                  <Textarea
                    value={blogForm.contenido}
                    onChange={(e) =>
                      setBlogForm((prev) => ({
                        ...prev,
                        contenido: e.target.value,
                      }))
                    }
                    required
                    rows={8}
                    className="bg-slate-800 border-slate-700 text-white"
                    data-testid="textarea-blog-contenido"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-300">
                    Fecha
                  </label>
                  <Input
                    type="date"
                    value={blogForm.fecha}
                    onChange={(e) =>
                      setBlogForm((prev) => ({
                        ...prev,
                        fecha: e.target.value,
                      }))
                    }
                    className="bg-slate-800 border-slate-700 text-white"
                    data-testid="input-blog-fecha"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    Imágenes
                  </label>
                  {blogForm.existingImagenes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {blogForm.existingImagenes.map((file, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={file}
                            alt="Blog"
                            className="w-20 h-20 object-cover rounded border border-slate-700"
                          />
                          <button
                            type="button"
                            onClick={() => removeBlogImage(file)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-600 rounded-lg cursor-pointer hover:bg-slate-800">
                    <Upload className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-400">
                      {newBlogImages
                        ? `${newBlogImages.length} archivos`
                        : "Subir imágenes"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => setNewBlogImages(e.target.files)}
                      data-testid="input-file-blog-imagenes"
                    />
                  </label>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeBlogForm}
                    disabled={blogSubmitting}
                    className="border-slate-600 text-slate-300"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={blogSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    data-testid="button-submit-blog"
                  >
                    {blogSubmitting && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingBlogId ? "Guardar cambios" : "Crear post"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {showTestimonialForm && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto p-4">
          <Card className="w-full max-w-2xl my-8 bg-slate-900 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-slate-700">
              <CardTitle className="text-white">
                {editingTestimonialId
                  ? "Editar Testimonio"
                  : "Nuevo Testimonio"}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeTestimonialForm}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleTestimonialSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">
                      Autor *
                    </label>
                    <Input
                      value={testimonialForm.autor}
                      onChange={(e) =>
                        setTestimonialForm((prev) => ({
                          ...prev,
                          autor: e.target.value,
                        }))
                      }
                      required
                      className="bg-slate-800 border-slate-700 text-white"
                      data-testid="input-testimonial-autor"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-slate-300">
                      Rol
                    </label>
                    <Input
                      value={testimonialForm.rol}
                      onChange={(e) =>
                        setTestimonialForm((prev) => ({
                          ...prev,
                          rol: e.target.value,
                        }))
                      }
                      placeholder="ej: Inversor, Familia joven"
                      className="bg-slate-800 border-slate-700 text-white"
                      data-testid="input-testimonial-rol"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-300">
                    Contenido *
                  </label>
                  <Textarea
                    value={testimonialForm.contenido}
                    onChange={(e) =>
                      setTestimonialForm((prev) => ({
                        ...prev,
                        contenido: e.target.value,
                      }))
                    }
                    required
                    rows={4}
                    className="bg-slate-800 border-slate-700 text-white"
                    data-testid="textarea-testimonial-contenido"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="aprobado"
                    checked={testimonialForm.aprobado}
                    onChange={(e) =>
                      setTestimonialForm((prev) => ({
                        ...prev,
                        aprobado: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800"
                    data-testid="checkbox-testimonial-aprobado"
                  />
                  <label htmlFor="aprobado" className="text-sm text-slate-300">
                    Aprobado (visible públicamente)
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-300">
                    Imagen
                  </label>
                  {testimonialForm.existingImagen && (
                    <div className="mb-2">
                      <img
                        src={testimonialForm.existingImagen}
                        alt="Testimonio"
                        className="w-20 h-20 object-cover rounded"
                      />
                    </div>
                  )}
                  <label className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-600 rounded-lg cursor-pointer hover:bg-slate-800">
                    <Upload className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-400">
                      {newTestimonialImage
                        ? newTestimonialImage.name
                        : "Subir imagen"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setNewTestimonialImage(e.target.files?.[0] || null)
                      }
                      data-testid="input-file-testimonial-imagen"
                    />
                  </label>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeTestimonialForm}
                    disabled={testimonialSubmitting}
                    className="border-slate-600 text-slate-300"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={testimonialSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    data-testid="button-submit-testimonial"
                  >
                    {testimonialSubmitting && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {editingTestimonialId
                      ? "Guardar cambios"
                      : "Crear testimonio"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
