import landImage from '@assets/generated_images/aerial_view_of_residential_land_lots_subdivision.png';

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Imagen de fondo */}
      <img
        src={landImage}
        alt="Proyectos de lotes de terrenos en Argentina"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Overlay gradiente más corporativo */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>

      {/* Contenido centrado */}
      <div className="relative z-10 w-full py-24 md:py-32 flex items-center justify-center">
        <div className="mx-auto max-w-6xl px-4 w-full text-center">
          <div className="space-y-8">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-white tracking-tight">
              Te acompañamos en cada paso, conectándote con proyectos sólidos y confiables.
            </h1>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#proyectos"
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-3 font-semibold transition inline-block"
                data-testid="button-view-projects"
              >
                Ver proyectos disponibles
              </a>
              <a
                href="#contacto"
                className="border-2 border-white text-white px-8 py-3 font-semibold hover:bg-white/10 transition inline-block"
                data-testid="button-contact-info"
              >
                Quiero más información
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
