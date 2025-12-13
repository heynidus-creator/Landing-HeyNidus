import { useQuery } from "@tanstack/react-query";
import type { Project } from "@shared/schema";
import { AlertCircle } from "lucide-react";
import barrioBg from "@assets/DJI_20251119104425_0010_D_1763965801429.JPG?url";
import altosVallesBg from "@assets/generated_images/altos_valles_glew_lots.png";
import altoCañuelaBg from "@assets/generated_images/alto_de_cañuela_lots.png";
import vallesPinoBg from "@assets/generated_images/flat_agricultural_field_la_matanza.png";
import { SectionCard } from "./SectionCard";

// ✅ Fallback local (si API falla o viene vacía)
import { projects as fallbackProjects } from "../data/siteData";

const ProjectImageMap: Record<string, string> = {
  "1": barrioBg,
  "2": altosVallesBg,
  "3": altoCañuelaBg,
  "4": vallesPinoBg,
};

/**
 * Normaliza un "project" venga de la API o de siteData.ts
 * para que el render no se rompa.
 */
function normalizeProjects(apiProjects: Project[] | undefined): Array<any> {
  const hasApi = Array.isArray(apiProjects) && apiProjects.length > 0;

  if (hasApi) {
    return apiProjects.map((p: any) => ({
      id: String(p.id),
      nombre: p.nombre ?? "",
      tipo: p.tipo ?? "Proyecto de terceros",
      etapa: p.etapa ?? "",
      descripcion: p.descripcion ?? "",
      ubicacionTexto: p.ubicacionTexto ?? p.ubicacion ?? "",
      imagenes: Array.isArray(p.imagenes) ? p.imagenes : [],
    }));
  }

  // Fallback desde siteData.ts
  return (fallbackProjects || []).map((p: any) => ({
    id: String(p.id),
    nombre: p.nombre ?? "",
    tipo: p.tipo ?? "Proyecto de terceros",
    etapa: p.etapa ?? "",
    descripcion: p.descripcion ?? "",
    ubicacionTexto: p.ubicacion ?? "",
    // siteData trae "imagen" (string). Lo pasamos como lista para mantener lógica.
    imagenes: p.imagen ? [p.imagen] : [],
  }));
}

const Projects = () => {
  const {
    data: apiProjects,
    isLoading,
    isError,
  } = useQuery<Project[]>({
    queryKey: ["/api/projects/list"],
  });

  const projects = normalizeProjects(apiProjects);
  const usingFallback = !apiProjects || apiProjects.length === 0;

  if (isLoading) {
    return (
      <SectionCard className="mx-auto max-w-6xl px-3 sm:px-4 w-full">
        <div className="mb-6 sm:mb-8 space-y-2 sm:space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Proyectos
          </h2>
          <p className="text-sm md:text-base text-slate-700 dark:text-slate-300">
            Combinamos desarrollos propios y de terceros para que encuentres el
            lote que mejor se adapte a tu plan de vida o inversión.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 w-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden">
                <div className="h-40 sm:h-48 bg-slate-300 dark:bg-slate-600" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-300 dark:bg-slate-600 rounded w-3/4" />
                  <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-1/2" />
                  <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    );
  }

  // ✅ Si hay error PERO tenemos fallback, no mostramos el error.
  const showHardError =
    (isError && (fallbackProjects?.length ?? 0) === 0) || projects.length === 0;

  if (showHardError) {
    return (
      <SectionCard className="mx-auto max-w-6xl px-3 sm:px-4 w-full">
        <div className="mb-6 sm:mb-8 space-y-2 sm:space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Proyectos
          </h2>
          <p className="text-sm md:text-base text-slate-700 dark:text-slate-300">
            Combinamos desarrollos propios y de terceros para que encuentres el
            lote que mejor se adapte a tu plan de vida o inversión.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Error al cargar proyectos
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            No pudimos cargar los proyectos. Intenta recargar la página.
          </p>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard className="mx-auto max-w-6xl px-3 sm:px-4 w-full">
      <div className="mb-6 sm:mb-8 space-y-2 sm:space-y-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Proyectos
        </h2>
        <p className="text-sm md:text-base text-slate-700 dark:text-slate-300">
          Combinamos desarrollos propios y de terceros para que encuentres el
          lote que mejor se adapte a tu plan de vida o inversión.
        </p>

        {/* (Opcional) si querés ver cuándo está usando fallback en prod, descomentá:
        {usingFallback && (
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Mostrando contenido de respaldo (fallback). Conectando con la API...
          </p>
        )} */}
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 w-full">
        {projects.map((project: any) => {
          const firstImage = project.imagenes?.[0];

          // Si viene de la API con uploads: a veces ya viene con "uploads/.."
          // Lo normalizamos para que siempre empiece con "/"
          const apiImage = firstImage
            ? firstImage.startsWith("/")
              ? firstImage
              : `/${firstImage}`
            : "";

          // Si no hay imagen real, usamos el mapa por ID (assets importados)
          const projectImage =
            apiImage || ProjectImageMap[String(project.id)] || "";

          const isComingSoon =
            String(project.etapa || "")
              .toLowerCase()
              .includes("próxim") ||
            String(project.etapa || "")
              .toLowerCase()
              .includes("proxim");

          return (
            <article
              key={project.id}
              className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition overflow-hidden h-full"
              data-testid={`card-project-${project.id}`}
            >
              <div className="relative w-full h-40 sm:h-48 bg-slate-200 dark:bg-slate-700 flex-shrink-0 overflow-hidden">
                {projectImage ? (
                  <img
                    src={projectImage}
                    alt={project.nombre}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23334155" width="400" height="300"/%3E%3C/svg%3E';
                    }}
                    className={`w-full h-full object-cover ${isComingSoon ? "blur-sm" : ""}`}
                  />
                ) : (
                  <div className="w-full h-full" />
                )}

                {isComingSoon && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="text-2xl font-bold text-white tracking-widest">
                      PROXIMAMENTE
                    </span>
                  </div>
                )}
              </div>

              {/* ✅ Esto asegura mismo alto “visual” y botón siempre abajo */}
              <div className="p-5 flex flex-col flex-1 min-h-0">
                <div className="flex-1 min-h-0">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1 line-clamp-2">
                    {project.nombre}
                  </h3>

                  <div className="flex gap-2 mb-1 flex-wrap">
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      {project.tipo}
                    </p>
                    {project.etapa && (
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">
                        {project.etapa}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 line-clamp-1">
                    {project.ubicacionTexto}
                  </p>

                  <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3">
                    {project.descripcion}
                  </p>
                </div>

                <div className="mt-4 flex gap-3 flex-col sm:flex-row flex-shrink-0">
                  <a
                    href={`/proyecto/${project.id}`}
                    className="inline-flex items-center justify-center rounded-full bg-emerald-600 dark:bg-emerald-600 px-3 sm:px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 dark:hover:bg-emerald-700 transition"
                    data-testid={`button-project-detail-${project.id}`}
                  >
                    Ver más
                  </a>

                  <button
                    onClick={() => {
                      const contactSection =
                        document.getElementById("contacto");
                      if (contactSection) {
                        contactSection.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                        setTimeout(() => {
                          const input = document.querySelector(
                            'select[name="tipoConsulta"]',
                          ) as HTMLSelectElement;
                          if (input) input.focus();
                        }, 500);
                      }
                    }}
                    className="inline-flex items-center justify-center rounded-full border border-emerald-600 dark:border-emerald-500 px-3 sm:px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition"
                    data-testid={`button-project-contact-${project.id}`}
                    type="button"
                  >
                    Contactar
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </SectionCard>
  );
};

export default Projects;
