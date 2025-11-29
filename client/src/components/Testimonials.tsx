import { useState, memo } from 'react';
import { testimonials } from '../data/siteData';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionCard } from './SectionCard';
import testimonialImage1 from '@assets/generated_images/argentine_couple_casual_natural.png';
import testimonialImage2 from '@assets/generated_images/latina_woman_buenos_aires.png';
import testimonialImage3 from '@assets/generated_images/argentine_man_casual.png';
import testimonialImage4 from '@assets/generated_images/latina_woman_home_setting.png';
import testimonialImage5 from '@assets/generated_images/argentine_family_outdoor.png';
import testimonialImage6 from '@assets/generated_images/mature_latino_man.png';
import testimonialImage7 from '@assets/generated_images/latina_woman_outdoor_natural.png';
import testimonialImage8 from '@assets/generated_images/latino_man_friendly_casual.png';
import testimonialImage9 from '@assets/generated_images/argentine_man_urban_casual.png';
import testimonialImage10 from '@assets/generated_images/latino_couple_buenos_aires.png';

const testimonialImageMap: Record<string, string> = {
  'casual_young_couple_natural.png': testimonialImage1,
  'casual_young_woman_natural.png': testimonialImage2,
  'casual_man_natural_portrait.png': testimonialImage3,
  'casual_woman_natural_portrait.png': testimonialImage4,
  'family_candid_outdoor_portrait.png': testimonialImage5,
  'mature_man_casual_natural.png': testimonialImage6,
  'woman_nature_casual_portrait.png': testimonialImage7,
  'man_casual_friendly_natural.png': testimonialImage8,
  'man_outdoor_casual_natural.png': testimonialImage9,
  'couple_casual_happy_natural.png': testimonialImage10,
};

const Testimonials = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const itemsToShow = 3;
  const visibleTestimonials = [];
  
  for (let i = 0; i < itemsToShow; i++) {
    const index = (currentIndex + i) % testimonials.length;
    visibleTestimonials.push(testimonials[index]);
  }

  return (
    <SectionCard className="mx-auto max-w-6xl px-4">
      <div className="mb-12 space-y-3">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Lo que dicen nuestros clientes</h2>
        <p className="text-sm md:text-base text-slate-700 dark:text-slate-300">
          Historias reales de personas que encontraron su oportunidad con HeyNidus
        </p>
      </div>

      <div className="relative">
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {visibleTestimonials.map((testimonial, idx) => (
            <div key={`${currentIndex}-${idx}`}>
              <div
                className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-sm hover:shadow-md transition"
                data-testid={`card-testimonial-${testimonial.id}`}
              >
              <div className="w-full h-48 overflow-hidden bg-slate-100 dark:bg-slate-700">
                <img
                  src={testimonialImageMap[testimonial.imagen] || ''}
                  alt={testimonial.autor}
                  className="w-full h-full object-cover"
                  data-testid={`img-testimonial-${testimonial.id}`}
                />
              </div>

              <div className="p-5 flex flex-col flex-1">
                <p className="mb-4 text-xs md:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{testimonial.contenido}"
                </p>

                <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700">
                  <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{testimonial.autor}</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">{testimonial.rol}</p>
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={goToPrevious}
            className="flex items-center justify-center rounded-full border border-slate-300 dark:border-slate-600 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            data-testid="button-prev-testimonial"
            type="button"
            aria-label="Testimonios anteriores"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index >= currentIndex && index < currentIndex + itemsToShow
                    ? 'w-8 bg-emerald-700 dark:bg-emerald-600'
                    : 'w-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                }`}
                data-testid={`dot-testimonial-${index}`}
                type="button"
                aria-label={`Ir al testimonio ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="flex items-center justify-center rounded-full border border-slate-300 dark:border-slate-600 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            data-testid="button-next-testimonial"
            type="button"
            aria-label="Siguientes testimonios"
          >
            <ChevronRight className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
          {currentIndex + 1} - {Math.min(currentIndex + itemsToShow, testimonials.length)} de {testimonials.length}
        </div>
      </div>
    </SectionCard>
  );
});

Testimonials.displayName = 'Testimonials';

export default Testimonials;
