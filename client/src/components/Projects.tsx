import { useQuery } from '@tanstack/react-query';
import type { Project } from '@shared/schema';
import { AlertCircle } from 'lucide-react';
import barrioBg from '@assets/DJI_20251119104425_0010_D_1763965801429.JPG?url';
import altosVallesBg from '@assets/generated_images/altos_valles_glew_lots.png';
import altoCañuelaBg from '@assets/generated_images/alto_de_cañuela_lots.png';
import vallesPinoBg from '@assets/generated_images/flat_agricultural_field_la_matanza.png';
import { SectionCard } from './SectionCard';

const ProjectImageMap: Record<string, string> = {
  '1': barrioBg,
  '2': altosVallesBg,
  '3': altoCañuelaBg,
  '4': vallesPinoBg,
};

const Projects = () => {
  const { data: projects, isLoading, isError } = useQuery<Project[]>({
    queryKey: ['/api/projects/list'],
  });

  if (isLoading) {
    return (
      <SectionCard className="mx-auto max-w-6xl px-3 sm:px-4 w-full">
        <div className="mb-6 sm:mb-8 space-y-2 sm:space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Proyectos</h2>
          <p className="text-sm md:text-base text-slate-700 dark:text-slate-300">
            Combinamos desarrollos propios y de terceros para que encuentres el lote que mejor se adapte a tu plan de vida
            o inversión.
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

  if (isError) {
    return (
      <SectionCard className="mx-auto max-w-6xl px-3 sm:px-4 w-full">
        <div className="mb-6 sm:mb-8 space-y-2 sm:space-y-3">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Proyectos</h2>
          <p className="text-sm md:text-base text-slate-700 dark:text-slate-300">
            Combinamos desarrollos propios y de terceros para que encuentres el lote que mejor se adapte a tu plan de vida
            o inversión.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">Error al cargar proyectos</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">No pudimos cargar los proyectos. Intenta recargar la página.</p>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard className="mx-auto max-w-6xl px-3 sm:px-4 w-full">
      <div className="mb-6 sm:mb-8 space-y-2 sm:space-y-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Proyectos</h2>
        <p className="text-sm md:text-base text-slate-700 dark:text-slate-300">
          Combinamos desarrollos propios y de terceros para que encuentres el lote que mejor se adapte a tu plan de vida
          o inversión.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 w-full">
        {projects?.map((project) => {
          const projectImage = project.imagenes?.[0] 
            ? `/${project.imagenes[0]}` 
            : ProjectImageMap[project.id] || '';
          
          return (
            <div key={project.id} className="h-full">
              <article
                className="flex flex-col h-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition overflow-hidden"
                data-testid={`card-project-${project.id}`}
              >
                <div className="relative w-full h-40 sm:h-48 bg-slate-200 dark:bg-slate-700 flex-shrink-0 overflow-hidden">
                  <img
                    src={projectImage}
                    alt={project.nombre}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e2e8f0" width="400" height="300"/%3E%3C/svg%3E';
                    }}
                    className={`w-full h-full object-cover ${
                      project.etapa === 'Próximamente' ? 'blur-sm' : ''
                    }`}
                  />
                  {project.etapa === 'Próximamente' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="text-2xl font-bold text-white tracking-widest">PROXIMAMENTE</span>
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1 min-h-0">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1 line-clamp-2">{project.nombre}</h3>
                    <div className="flex gap-2 mb-1 flex-wrap">
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{project.tipo}</p>
                      <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">{project.etapa}</p>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{project.ubicacionTexto}</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3">{project.descripcion}</p>
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
                        const contactSection = document.getElementById('contacto');
                        if (contactSection) {
                          contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          setTimeout(() => {
                            const input = document.querySelector('select[name="tipoConsulta"]') as HTMLSelectElement;
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
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
};

export default Projects;
