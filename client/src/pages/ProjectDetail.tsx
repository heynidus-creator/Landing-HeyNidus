import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import {
  MapPin,
  Layers,
  Zap,
  Leaf,
  Check,
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
  ExternalLink,
  Navigation,
  AlertCircle,
} from "lucide-react";

import barrioBg from "@assets/DJI_20251119104425_0010_D_1763965801429.JPG?url";
import altosVallesBg from "@assets/generated_images/altos_valles_glew_lots.png";
import altoCañuelaBg from "@assets/generated_images/alto_de_cañuela_lots.png";
import vallesPinoBg from "@assets/generated_images/flat_agricultural_field_la_matanza.png";

import masterPlan1 from "@assets/1_1764003433127.jpg";
import masterPlan2 from "@assets/2_1764003433128.jpg";
import masterPlan3 from "@assets/3_1764003433128.jpg";
import masterPlan4 from "@assets/4_1764003433128.jpg";
import masterPlan5 from "@assets/5_1764003433128.jpg";
import masterPlan6 from "@assets/6_1764003433128.jpg";
import masterPlan7 from "@assets/7_1764003433128.jpg";
import masterPlan8 from "@assets/8_1764003433128.jpg";
import masterPlan9 from "@assets/9_1764003433129.jpg";

import galeria1 from "@assets/DJI_20251119103752_0001_D_1764003659401.JPG?url";
import galeria2 from "@assets/DJI_20251119103802_0002_D_1764003659401.JPG?url";
import galeria3 from "@assets/DJI_20251119103820_0003_D_1764003659402.JPG?url";
import galeria4 from "@assets/DJI_20251119103852_0004_D_1764003659402.JPG?url";
import galeria5 from "@assets/DJI_20251119104306_0008_D_1764003659402.JPG?url";
import galeria6 from "@assets/DJI_20251119104408_0009_D_1764003659402.JPG?url";
import galeria7 from "@assets/DJI_20251119104425_0010_D_1764003659402.JPG?url";
import galeria8 from "@assets/DJI_20251119104431_0011_D_1764003659402.JPG?url";
import galeria9 from "@assets/DJI_20251119104737_0015_D_1764003659402.JPG?url";
import galeria10 from "@assets/DJI_20251119104746_0016_D_1764003659403.JPG?url";
import galeria11 from "@assets/DJI_20251119104801_0017_D_1764003659403.JPG?url";
import galeria12 from "@assets/DJI_20251119104808_0018_D_1764003659403.JPG?url";

const ProjectImageMap: Record<string, string> = {
  "1": barrioBg,
  "2": altosVallesBg,
  "3": altoCañuelaBg,
  "4": vallesPinoBg,
};

const defaultMasterPlanImages = [
  masterPlan1,
  masterPlan2,
  masterPlan3,
  masterPlan4,
  masterPlan5,
  masterPlan6,
  masterPlan7,
  masterPlan8,
  masterPlan9,
];

const defaultGaleriaImages = [
  galeria1,
  galeria2,
  galeria3,
  galeria4,
  galeria5,
  galeria6,
  galeria7,
  galeria8,
  galeria9,
  galeria10,
  galeria11,
  galeria12,
];

function normalizePathMaybe(p?: string) {
  if (!p) return "";
  const s = String(p);
  return s.startsWith("/") ? s : `/${s}`;
}

function isUploadsPath(p?: string) {
  if (!p) return false;
  return String(p).includes("/uploads/");
}

function isVercelLikeHost() {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return h.includes("vercel.app") || h.includes("heynidus");
}

const FALLBACK_SVG =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23334155" width="400" height="300"/%3E%3C/svg%3E';

const ProjectDetail = () => {
  const params = useParams<{ id: string }>();
  const projectId = params?.id;

  const [currentMasterPlanIndex, setCurrentMasterPlanIndex] = useState(0);
  const [currentGaleriaIndex, setCurrentGaleriaIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<
    "master-plan" | "galeria" | "videos"
  >("master-plan");
  const [masterPlanFullscreen, setMasterPlanFullscreen] = useState(false);
  const [galeriaFullscreen, setGaleriaFullscreen] = useState(false);

  // ✅ QueryKey como URL real (aprovecha el queryClient default)
  const projectUrl = useMemo(
    () => (projectId ? `/api/projects/${projectId}` : ""),
    [projectId],
  );

  const {
    data: project,
    isLoading,
    isError,
  } = useQuery<Project>({
    queryKey: projectUrl ? [projectUrl] : ["__no_project__"],
    enabled: !!projectId,
  });

  const idStr = useMemo(
    () => String((project as any)?.id ?? projectId ?? ""),
    [project, projectId],
  );

  const fallbackCover = ProjectImageMap[idStr] || "";

  const heroImage = useMemo(() => {
    const first = (project as any)?.imagenes?.[0];
    const api = normalizePathMaybe(first);
    const vercelLike = isVercelLikeHost();

    // En Vercel, si viene /uploads, suele romper => usar cover por ID
    if (vercelLike && isUploadsPath(api)) return fallbackCover || "";
    return api || fallbackCover || "";
  }, [project, fallbackCover]);

  const masterPlanImages = useMemo(() => {
    const files = Array.isArray((project as any)?.masterPlanFiles)
      ? (project as any).masterPlanFiles
      : [];
    const apiList = files
      .map((f: string) => normalizePathMaybe(f))
      .filter(Boolean);

    const vercelLike = isVercelLikeHost();
    const hasNonUpload = apiList.some((p: string) => !isUploadsPath(p));
    const usableApiList =
      vercelLike && apiList.length > 0 && !hasNonUpload ? [] : apiList;

    if (idStr === "1") {
      return usableApiList.length > 0 ? usableApiList : defaultMasterPlanImages;
    }
    return usableApiList;
  }, [project, idStr]);

  const galeriaImages = useMemo(() => {
    const imgs = Array.isArray((project as any)?.imagenes)
      ? (project as any).imagenes
      : [];
    const apiList = imgs
      .map((f: string) => normalizePathMaybe(f))
      .filter(Boolean);

    const vercelLike = isVercelLikeHost();
    const hasNonUpload = apiList.some((p: string) => !isUploadsPath(p));
    const usableApiList =
      vercelLike && apiList.length > 0 && !hasNonUpload ? [] : apiList;

    if (idStr === "1") {
      return usableApiList.length > 0 ? usableApiList : defaultGaleriaImages;
    }
    return usableApiList;
  }, [project, idStr]);

  useEffect(() => {
    setCurrentMasterPlanIndex((i) =>
      masterPlanImages.length === 0
        ? 0
        : Math.min(i, masterPlanImages.length - 1),
    );
  }, [masterPlanImages.length]);

  useEffect(() => {
    setCurrentGaleriaIndex((i) =>
      galeriaImages.length === 0 ? 0 : Math.min(i, galeriaImages.length - 1),
    );
  }, [galeriaImages.length]);

  const goToPreviousMasterPlan = () => {
    if (masterPlanImages.length <= 1) return;
    setCurrentMasterPlanIndex((prevIndex) =>
      prevIndex === 0 ? masterPlanImages.length - 1 : prevIndex - 1,
    );
  };

  const goToNextMasterPlan = () => {
    if (masterPlanImages.length <= 1) return;
    setCurrentMasterPlanIndex((prevIndex) =>
      prevIndex === masterPlanImages.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const goToPreviousGaleria = () => {
    if (galeriaImages.length <= 1) return;
    setCurrentGaleriaIndex((prevIndex) =>
      prevIndex === 0 ? galeriaImages.length - 1 : prevIndex - 1,
    );
  };

  const goToNextGaleria = () => {
    if (galeriaImages.length <= 1) return;
    setCurrentGaleriaIndex((prevIndex) =>
      prevIndex === galeriaImages.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setMasterPlanFullscreen(false);
      setGaleriaFullscreen(false);
    } else if (e.key === "ArrowLeft") {
      if (masterPlanFullscreen) goToPreviousMasterPlan();
      if (galeriaFullscreen) goToPreviousGaleria();
    } else if (e.key === "ArrowRight") {
      if (masterPlanFullscreen) goToNextMasterPlan();
      if (galeriaFullscreen) goToNextGaleria();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16">
        <div className="mx-auto max-w-6xl px-3 sm:px-4 w-full">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-slate-300 dark:bg-slate-700 rounded-lg" />
            <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded w-1/2" />
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16">
        <div className="mx-auto max-w-6xl px-3 sm:px-4 w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Error al cargar el proyecto
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            No pudimos cargar la información del proyecto. Intenta nuevamente.
          </p>
          <Link href="/" className="text-emerald-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16">
        <div className="mx-auto max-w-6xl px-3 sm:px-4 w-full text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Proyecto no encontrado
          </h1>
          <Link href="/" className="text-emerald-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  const maps = (project as any)?.maps || {};
  const lat = maps?.lat;
  const lng = maps?.lng;
  const hasLocation = !!lat && !!lng;
  const hasPlaceUrl = !!maps?.placeUrl;

  const isComingSoon =
    String((project as any).etapa || "")
      .toLowerCase()
      .includes("próxim") ||
    String((project as any).etapa || "")
      .toLowerCase()
      .includes("proxim");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="w-full h-48 sm:h-64 md:h-96 bg-slate-200 overflow-hidden">
        <img
          src={heroImage || fallbackCover || FALLBACK_SVG}
          alt={(project as any).nombre}
          className={`w-full h-full object-cover ${isComingSoon ? "blur-sm" : ""}`}
          data-testid={`img-project-detail-${idStr}`}
          onError={(e) => {
            const img = e.currentTarget;
            if (fallbackCover && img.src !== fallbackCover) {
              img.src = fallbackCover;
              return;
            }
            img.src = FALLBACK_SVG;
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-3 sm:px-4 w-full py-6 sm:py-12">
        <div className="mb-6 sm:mb-12">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {(project as any).tipo}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">
              {(project as any).etapa}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {(project as any).nombre}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            {(project as any).ubicacionTexto}
          </p>
        </div>

        <div className="grid gap-6 sm:gap-12 lg:grid-cols-3 w-full">
          <div className="lg:col-span-2 space-y-8 w-full min-w-0">
            <div className="w-full min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Sobre el proyecto
              </h2>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed break-words whitespace-pre-line">
                {(project as any).contenidoLargo ||
                  (project as any).descripcion}
              </p>
            </div>

            {(project as any).caracteristicas &&
              (project as any).caracteristicas.length > 0 && (
                <div className="w-full min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    Características principales
                  </h2>
                  <div className="grid gap-3">
                    {(project as any).caracteristicas.map(
                      (caracteristica: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex gap-3 items-start w-full min-w-0"
                        >
                          <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 break-words">
                            {caracteristica}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

            {(project as any).servicios &&
              (project as any).servicios.length > 0 && (
                <div className="w-full min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    Servicios
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    {(project as any).servicios.map(
                      (servicio: string, idx: number) => (
                        <div
                          key={idx}
                          className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 w-full min-w-0"
                        >
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 break-words">
                            {servicio}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

            {(project as any).amenidades &&
              (project as any).amenidades.length > 0 && (
                <div className="w-full min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    Amenidades
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                    {(project as any).amenidades.map(
                      (amenidad: string, idx: number) => (
                        <div
                          key={idx}
                          className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 w-full min-w-0"
                        >
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 break-words">
                            {amenidad}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

            {(hasLocation || hasPlaceUrl) && (
              <div className="w-full min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  Ubicación
                </h3>

                {hasLocation && (
                  <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 mb-4">
                    <iframe
                      src={`https://www.google.com/maps?q=${encodeURIComponent(
                        `${lat},${lng}`,
                      )}&z=15&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Ubicación de ${(project as any).nombre}`}
                    />
                  </div>
                )}

                {hasPlaceUrl && (
                  <a
                    href={(project as any).maps.placeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-4 py-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition text-sm"
                    data-testid="link-google-maps"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Ver en Google Maps
                  </a>
                )}
              </div>
            )}

            {(project as any).linkLotes && (
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-2xl border border-emerald-200 dark:border-emerald-700 p-4 sm:p-8">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  Lotes Disponibles
                </h3>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 mb-6">
                  Consulta el mapa interactivo para ver todos los lotes
                  disponibles y sus características.
                </p>
                <a
                  href={(project as any).linkLotes}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-full hover:bg-emerald-700 transition"
                  data-testid="link-lotes-disponibles"
                >
                  Ver Lotes Disponibles
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            )}

            {(masterPlanImages.length > 0 || galeriaImages.length > 0) && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Información del Proyecto
                </h2>

                <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 mb-6 overflow-x-auto">
                  {masterPlanImages.length > 0 && (
                    <button
                      onClick={() => setActiveTab("master-plan")}
                      className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition flex-shrink-0 ${
                        activeTab === "master-plan"
                          ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                          : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                      }`}
                      data-testid="tab-master-plan"
                      type="button"
                    >
                      Master Plan
                    </button>
                  )}

                  {galeriaImages.length > 0 && (
                    <button
                      onClick={() => setActiveTab("galeria")}
                      className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition flex-shrink-0 ${
                        activeTab === "galeria"
                          ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                          : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                      }`}
                      data-testid="tab-galeria"
                      type="button"
                    >
                      Galería
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTab("videos")}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold border-b-2 transition flex-shrink-0 ${
                      activeTab === "videos"
                        ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
                        : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                    data-testid="tab-videos"
                    type="button"
                  >
                    Videos
                  </button>
                </div>

                {activeTab === "master-plan" && masterPlanImages.length > 0 && (
                  <div className="space-y-4">
                    <div className="relative bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden w-full">
                      <div className="w-full h-48 sm:h-64 md:h-96 bg-slate-200 dark:bg-slate-700">
                        <img
                          src={masterPlanImages[currentMasterPlanIndex]}
                          alt={`Master Plan imagen ${currentMasterPlanIndex + 1}`}
                          className="w-full h-full object-contain"
                          data-testid={`img-master-plan-${currentMasterPlanIndex}`}
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_SVG;
                          }}
                        />
                      </div>

                      <div className="absolute inset-0 flex items-center justify-between p-2 sm:p-4">
                        <button
                          onClick={goToPreviousMasterPlan}
                          className="bg-black/50 hover:bg-black/70 text-white p-1 sm:p-2 rounded-full transition flex-shrink-0"
                          data-testid="button-prev-master-plan"
                          type="button"
                          aria-label="Imagen anterior"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                        </button>
                        <button
                          onClick={goToNextMasterPlan}
                          className="bg-black/50 hover:bg-black/70 text-white p-1 sm:p-2 rounded-full transition flex-shrink-0"
                          data-testid="button-next-master-plan"
                          type="button"
                          aria-label="Siguiente imagen"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                        </button>
                      </div>

                      <button
                        onClick={() => setMasterPlanFullscreen(true)}
                        className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/50 hover:bg-black/70 text-white p-1 sm:p-2 rounded-full transition flex-shrink-0"
                        data-testid="button-expand-master-plan"
                        type="button"
                        aria-label="Expandir a pantalla completa"
                      >
                        <Expand className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>

                      <div className="absolute bottom-2 left-0 right-0 text-center sm:bottom-4">
                        <span className="text-white text-xs sm:text-sm font-semibold bg-black/50 px-3 py-1 rounded-full inline-block">
                          {currentMasterPlanIndex + 1} /{" "}
                          {masterPlanImages.length}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 px-1">
                      {masterPlanImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentMasterPlanIndex(idx)}
                          className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition ${
                            idx === currentMasterPlanIndex
                              ? "border-emerald-600"
                              : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                          }`}
                          data-testid={`thumbnail-master-plan-${idx}`}
                          type="button"
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_SVG;
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "galeria" && galeriaImages.length > 0 && (
                  <div className="space-y-4">
                    <div className="relative bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden w-full">
                      <div className="w-full h-48 sm:h-64 md:h-96 bg-slate-200 dark:bg-slate-700">
                        <img
                          src={galeriaImages[currentGaleriaIndex]}
                          alt={`Galería imagen ${currentGaleriaIndex + 1}`}
                          className="w-full h-full object-cover"
                          data-testid={`img-galeria-${currentGaleriaIndex}`}
                          onError={(e) => {
                            e.currentTarget.src = FALLBACK_SVG;
                          }}
                        />
                      </div>

                      <div className="absolute inset-0 flex items-center justify-between p-2 sm:p-4">
                        <button
                          onClick={goToPreviousGaleria}
                          className="bg-black/50 hover:bg-black/70 text-white p-1 sm:p-2 rounded-full transition flex-shrink-0"
                          data-testid="button-prev-galeria"
                          type="button"
                          aria-label="Imagen anterior"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                        </button>
                        <button
                          onClick={goToNextGaleria}
                          className="bg-black/50 hover:bg-black/70 text-white p-1 sm:p-2 rounded-full transition flex-shrink-0"
                          data-testid="button-next-galeria"
                          type="button"
                          aria-label="Siguiente imagen"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                        </button>
                      </div>

                      <button
                        onClick={() => setGaleriaFullscreen(true)}
                        className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/50 hover:bg-black/70 text-white p-1 sm:p-2 rounded-full transition flex-shrink-0"
                        data-testid="button-expand-galeria"
                        type="button"
                        aria-label="Expandir a pantalla completa"
                      >
                        <Expand className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>

                      <div className="absolute bottom-2 left-0 right-0 text-center sm:bottom-4">
                        <span className="text-white text-xs sm:text-sm font-semibold bg-black/50 px-3 py-1 rounded-full inline-block">
                          {currentGaleriaIndex + 1} / {galeriaImages.length}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 px-1">
                      {galeriaImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentGaleriaIndex(idx)}
                          className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition ${
                            idx === currentGaleriaIndex
                              ? "border-emerald-600"
                              : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                          }`}
                          data-testid={`thumbnail-galeria-${idx}`}
                          type="button"
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_SVG;
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "videos" && (
                  <div className="text-center py-8 sm:py-12">
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                      Los videos del proyecto estarán disponibles pronto
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1 w-full min-w-0">
            <div className="sticky top-28 lg:top-32 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-6 space-y-4 sm:space-y-6 w-full">
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  Datos del proyecto
                </h3>

                {(project as any).lotes && (
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-500 uppercase font-semibold mb-1">
                      Disponibilidad
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                      {(project as any).lotes}
                    </p>
                  </div>
                )}

                {(project as any).superficie && (
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-500 uppercase font-semibold mb-1">
                      Superficie total
                    </p>
                    <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                      {(project as any).superficie}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-500 uppercase font-semibold mb-1">
                    Estado
                  </p>
                  <p className="text-sm sm:text-base font-semibold text-emerald-600 dark:text-emerald-400">
                    {(project as any).etapa}
                  </p>
                </div>
              </div>

              <div className="pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-700 space-y-2 sm:space-y-3">
                <a
                  href="https://wa.me/5491171077797"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-emerald-600 text-white font-semibold py-2 sm:py-3 text-sm sm:text-base rounded-full text-center hover:bg-emerald-700 transition"
                  data-testid="link-whatsapp-project"
                >
                  Consultar por WhatsApp
                </a>
                <Link
                  href="/#contacto"
                  className="block w-full border border-emerald-600 text-emerald-700 dark:text-emerald-400 font-semibold py-2 sm:py-3 text-sm sm:text-base rounded-full text-center hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition"
                  data-testid="link-contact-project"
                >
                  Enviar consulta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {masterPlanFullscreen && masterPlanImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setMasterPlanFullscreen(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          data-testid="modal-fullscreen-master-plan"
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={masterPlanImages[currentMasterPlanIndex]}
              alt={`Master Plan imagen ${currentMasterPlanIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_SVG;
              }}
            />

            <button
              onClick={() => setMasterPlanFullscreen(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition"
              data-testid="button-close-master-plan-fullscreen"
              type="button"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={goToPreviousMasterPlan}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition"
              data-testid="button-prev-master-plan-fullscreen"
              type="button"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={goToNextMasterPlan}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition"
              data-testid="button-next-master-plan-fullscreen"
              type="button"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="absolute bottom-4 left-0 right-0 text-center">
              <span className="text-white text-sm font-semibold bg-black/50 px-3 py-1 rounded-full inline-block">
                {currentMasterPlanIndex + 1} / {masterPlanImages.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {galeriaFullscreen && galeriaImages.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setGaleriaFullscreen(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          data-testid="modal-fullscreen-galeria"
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galeriaImages[currentGaleriaIndex]}
              alt={`Galería imagen ${currentGaleriaIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = FALLBACK_SVG;
              }}
            />

            <button
              onClick={() => setGaleriaFullscreen(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition"
              data-testid="button-close-galeria-fullscreen"
              type="button"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              onClick={goToPreviousGaleria}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition"
              data-testid="button-prev-galeria-fullscreen"
              type="button"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={goToNextGaleria}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition"
              data-testid="button-next-galeria-fullscreen"
              type="button"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            <div className="absolute bottom-4 left-0 right-0 text-center">
              <span className="text-white text-sm font-semibold bg-black/50 px-3 py-1 rounded-full inline-block">
                {currentGaleriaIndex + 1} / {galeriaImages.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
