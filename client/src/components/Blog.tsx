import { useState, useCallback } from 'react';
import { blogPosts } from '../data/siteData';
import blogImage1 from '@assets/generated_images/peaceful_nature_escape_landscape.png';
import blogImage2 from '@assets/generated_images/own_plot_of_land_freedom.png';
import blogImage3 from '@assets/generated_images/nature_with_modern_services.png';
import blogImage4 from '@assets/generated_images/investment_opportunities_growth.png';
import blogImage5 from '@assets/generated_images/pre-construction_development_phase.png';
import birdIcon from '@assets/image_1763966603851.png';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionCard } from './SectionCard';

const blogImageMap: Record<string, string> = {
  'peaceful_nature_escape_landscape.png': blogImage1,
  'own_plot_of_land_freedom.png': blogImage2,
  'nature_with_modern_services.png': blogImage3,
  'investment_real_estate_opportunity.png': blogImage4,
  'pre_construction_property_development.png': blogImage5,
};

const blogContent: Record<number, string> = {
  1: 'Vivir en el ruido constante de la ciudad afecta tu salud, productividad y bienestar. Un lote propio en un entorno natural es tu escape: aire fresco, tranquilidad y conexión con la naturaleza. Construir tu hogar en un espacio rodeado de verde no es un lujo, es una inversión en tu calidad de vida. Descubre cómo tener tu propio terreno es el primer paso para lograr la paz que mereces.',
  2: 'Poseer un lote propio va mucho más allá de una inversión financiera. Es la libertad absoluta de construir según tus sueños, sin restricciones. Elige el diseño, los materiales, el entorno. Tu propiedad refleja tu personalidad y valores. Es tu legado familiar, tu patrimonio, tu libertad. En HeyNidus te ayudamos a encontrar el lote que sea perfecto para construir la vida que imaginas.',
  3: 'El dilema clásico: naturaleza versus servicios. La buena noticia es que no tienes que elegir. Los desarrollos modernos como los que ofrecemos en HeyNidus combinan lo mejor de ambos mundos: zonas rodeadas de verde, tranquilidad y espacio, pero con acceso a agua, electricidad, rutas, educación y comercio. Es posible tener lo mejor de ambos lados.',
  4: 'Invertir en lotes es inteligente por varias razones: (1) Revalorización: el terreno siempre crece en valor conforme el área se desarrolla. (2) Libertad de construcción: construye tu hogar exactamente como lo deseas. (3) Demanda creciente: cada vez más personas buscan escapar de la ciudad. (4) Acceso a naturaleza: bienestar para ti y tu familia. (5) Potencial económico: posibilidad de alquilar, vender o desarrollar. Los lotes son inversiones sólidas que crecen con el tiempo.',
  5: 'Comprar en pozo significa adquirir un lote durante el desarrollo del proyecto, antes de que esté completamente terminado. Se paga en cuotas a medida que avanzan las etapas constructivas. Las ventajas incluyen precios más accesibles que al terminado, posibilidad de personalización, y excelente potencial de revalorización. Lo importante es verificar la trayectoria del desarrollador, conocer el cronograma, asegurar respaldo legal y comprender bien las condiciones de pago. Este sistema es muy común en Argentina y ofrece oportunidades reales para inversores inteligentes.',
};

import { memo } from 'react';

const Blog = memo(() => {
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', skipSnaps: false });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  const onInit = useCallback(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  if (emblaApi && !emblaApi.scrollSnapList) {
    onInit();
  }

  return (
    <SectionCard className="mx-auto max-w-6xl px-3 sm:px-4 w-full">
      <div className="mb-6 sm:mb-8 space-y-2 sm:space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-3">
          <span className="relative inline-block">
            Blog HeyNidus
            <img src={birdIcon} alt="bird" className="absolute w-5 h-5 -top-2 -right-6" style={{marginTop: '-2px'}} />
          </span>
        </h2>
        <p className="text-sm md:text-base text-slate-700 dark:text-slate-300">
          Compartimos información clave para ayudarte a tomar mejores decisiones al momento de elegir un lote o evaluar
          un proyecto.
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 w-full">
        <button
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className="flex-shrink-0 p-1 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
          data-testid="button-carousel-prev"
        >
          <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
        </button>

        <div className="flex-1 min-w-0 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 sm:gap-6">
            {blogPosts.map((post, idx) => (
              <div key={post.id}>
                <article
                  className="flex-shrink-0 w-64 sm:w-80 flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:shadow-md transition"
                  data-testid={`card-blog-${post.id}`}
                >
                <div className="w-full h-48 overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <img
                    src={blogImageMap[post.imagen] || ''}
                    alt={post.titulo}
                    className="w-full h-full object-cover"
                    data-testid={`img-blog-${post.id}`}
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{post.fecha}</p>
                  <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">{post.titulo}</h3>
                  <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300">{post.resumen}</p>
                </div>
                <div className="px-5 pb-5">
                  <button
                    type="button"
                    onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                    className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition"
                    data-testid={`button-read-more-${post.id}`}
                  >
                    {selectedPost === post.id ? 'Leer menos ↑' : 'Leer más →'}
                  </button>
                  {selectedPost === post.id && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {blogContent[post.id]}
                    </div>
                  )}
                </div>
                </article>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={scrollNext}
          disabled={!canScrollNext}
          className="flex-shrink-0 p-1 sm:p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
          data-testid="button-carousel-next"
        >
          <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
        </button>
      </div>
    </SectionCard>
  );
});

Blog.displayName = 'Blog';

export default Blog;
