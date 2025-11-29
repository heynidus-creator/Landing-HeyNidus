import { projects } from '../data/siteData';
import barrioBg from '@assets/DJI_20251119104425_0010_D_1763965801429.JPG?url';
import altosVallesBg from '@assets/generated_images/altos_valles_glew_lots.png';
import altoCañuelaBg from '@assets/generated_images/alto_de_cañuela_lots.png';
import vallesPinoBg from '@assets/generated_images/flat_agricultural_field_la_matanza.png';

const ProjectImageMap: Record<string, string> = {
  'barrio_capinota_real.jpg': barrioBg,
  'altos_valles_glew_lots.png': altosVallesBg,
  'alto_de_cañuela_lots.png': altoCañuelaBg,
  'flat_agricultural_field_la_matanza.png': vallesPinoBg,
};

const Projects = () => {
  return (
    <div className="mx-auto max-w-6xl px-3 sm:px-4 w-full overflow-x-hidden">
      <div className="mb-6 sm:mb-8 space-y-2 sm:space-y-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Proyectos</h2>
        <p className="text-sm md:text-base text-slate-700 dark:text-slate-300">
          Combinamos desarrollos propios y de terceros para que encuentres el lote que mejor se adapte a tu plan de vida
          o inversión.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 w-full overflow-x-hidden">
        {projects.map((project) => (
          <article
            key={project.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition overflow-hidden"
            data-testid={`card-project-${project.id}`}
          >
            <div className="relative w-full h-40 sm:h-48 bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <img
                src={ProjectImageMap[project.imagen] || ''}
                alt={project.nombre}
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
            <div className="p-5 flex flex-col justify-between flex-1">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">{project.nombre}</h3>
                <div className="flex gap-2 mb-1">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{project.tipo}</p>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">{project.etapa}</p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{project.ubicacion}</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{project.descripcion}</p>
              </div>
              <div className="mt-4 flex gap-3 flex-col sm:flex-row">
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
        ))}
      </div>
    </div>
  );
};

export default Projects;
