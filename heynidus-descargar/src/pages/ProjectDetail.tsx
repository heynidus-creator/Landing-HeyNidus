import { useState } from 'react';
import { useLocation, Link } from 'wouter';
import { projects } from '../data/siteData';
import { ArrowLeft, MapPin, Layers, Zap, Leaf, Check, ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import barrioBg from '@assets/DJI_20251119104425_0010_D_1763965801429.JPG?url';
import altosVallesBg from '@assets/generated_images/altos_valles_glew_lots.png';
import altoCañuelaBg from '@assets/generated_images/alto_de_cañuela_lots.png';
import vallesPinoBg from '@assets/generated_images/flat_agricultural_field_la_matanza.png';
import masterPlan1 from '@assets/1_1764003433127.jpg';
import masterPlan2 from '@assets/2_1764003433128.jpg';
import masterPlan3 from '@assets/3_1764003433128.jpg';
import masterPlan4 from '@assets/4_1764003433128.jpg';
import masterPlan5 from '@assets/5_1764003433128.jpg';
import masterPlan6 from '@assets/6_1764003433128.jpg';
import masterPlan7 from '@assets/7_1764003433128.jpg';
import masterPlan8 from '@assets/8_1764003433128.jpg';
import masterPlan9 from '@assets/9_1764003433129.jpg';
import galeria1 from '@assets/DJI_20251119103752_0001_D_1764003659401.JPG?url';
import galeria2 from '@assets/DJI_20251119103802_0002_D_1764003659401.JPG?url';
import galeria3 from '@assets/DJI_20251119103820_0003_D_1764003659402.JPG?url';
import galeria4 from '@assets/DJI_20251119103852_0004_D_1764003659402.JPG?url';
import galeria5 from '@assets/DJI_20251119104306_0008_D_1764003659402.JPG?url';
import galeria6 from '@assets/DJI_20251119104408_0009_D_1764003659402.JPG?url';
import galeria7 from '@assets/DJI_20251119104425_0010_D_1764003659402.JPG?url';
import galeria8 from '@assets/DJI_20251119104431_0011_D_1764003659402.JPG?url';
import galeria9 from '@assets/DJI_20251119104737_0015_D_1764003659402.JPG?url';
import galeria10 from '@assets/DJI_20251119104746_0016_D_1764003659403.JPG?url';
import galeria11 from '@assets/DJI_20251119104801_0017_D_1764003659403.JPG?url';
import galeria12 from '@assets/DJI_20251119104808_0018_D_1764003659403.JPG?url';

const ProjectImageMap: Record<string, string> = {
  'barrio_capinota_real.jpg': barrioBg,
  'altos_valles_glew_lots.png': altosVallesBg,
  'alto_de_cañuela_lots.png': altoCañuelaBg,
  'flat_agricultural_field_la_matanza.png': vallesPinoBg,
};

const masterPlanImages = [masterPlan1, masterPlan2, masterPlan3, masterPlan4, masterPlan5, masterPlan6, masterPlan7, masterPlan8, masterPlan9];
const galeriaImages = [galeria1, galeria2, galeria3, galeria4, galeria5, galeria6, galeria7, galeria8, galeria9, galeria10, galeria11, galeria12];

const ProjectDetail = () => {
  const [location] = useLocation();
  const [currentMasterPlanIndex, setCurrentMasterPlanIndex] = useState(0);
  const [currentGaleriaIndex, setCurrentGaleriaIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'master-plan' | 'galeria' | 'videos'>('master-plan');
  const [masterPlanFullscreen, setMasterPlanFullscreen] = useState(false);
  const [galeriaFullscreen, setGaleriaFullscreen] = useState(false);
  const projectId = parseInt(location.split('/proyecto/')[1], 10);
  const project = projects.find((p) => p.id === projectId);

  const goToPreviousMasterPlan = () => {
    setCurrentMasterPlanIndex((prevIndex) =>
      prevIndex === 0 ? masterPlanImages.length - 1 : prevIndex - 1
    );
  };

  const goToNextMasterPlan = () => {
    setCurrentMasterPlanIndex((prevIndex) =>
      prevIndex === masterPlanImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPreviousGaleria = () => {
    setCurrentGaleriaIndex((prevIndex) =>
      prevIndex === 0 ? galeriaImages.length - 1 : prevIndex - 1
    );
  };

  const goToNextGaleria = () => {
    setCurrentGaleriaIndex((prevIndex) =>
      prevIndex === galeriaImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setMasterPlanFullscreen(false);
      setGaleriaFullscreen(false);
    } else if (e.key === 'ArrowLeft') {
      if (masterPlanFullscreen) goToPreviousMasterPlan();
      if (galeriaFullscreen) goToPreviousGaleria();
    } else if (e.key === 'ArrowRight') {
      if (masterPlanFullscreen) goToNextMasterPlan();
      if (galeriaFullscreen) goToNextGaleria();
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Proyecto no encontrado</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Imagen Principal */}
      <div className="w-full h-96 bg-slate-200 overflow-hidden">
        <img
          src={ProjectImageMap[project.imagen] || ''}
          alt={project.nombre}
          className="w-full h-full object-cover"
          data-testid={`img-project-detail-${project.id}`}
        />
      </div>

      {/* Contenido */}
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-semibold text-emerald-700">{project.tipo}</span>
            <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{project.etapa}</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">{project.nombre}</h1>
          <p className="text-slate-600 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {project.ubicacion}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Descripción */}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Sobre el proyecto</h2>
              <p className="text-slate-700 leading-relaxed">
                {project.detalleCompleto || project.descripcion}
              </p>
            </div>

            {/* Características */}
            {project.caracteristicas && project.caracteristicas.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Características principales</h2>
                <div className="grid gap-3">
                  {project.caracteristicas.map((caracteristica, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-700">{caracteristica}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Servicios */}
            {project.servicios && project.servicios.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-600" />
                  Servicios
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {project.servicios.map((servicio, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200">
                      <p className="text-sm font-semibold text-slate-900">{servicio}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenidades */}
            {project.amenidades && project.amenidades.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                  Amenidades
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {project.amenidades.map((amenidad, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200">
                      <p className="text-sm font-semibold text-slate-900">{amenidad}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lotes Disponibles - Solo para Barrio Capinota */}
            {project.id === 1 && (
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200 p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  Lotes Disponibles
                </h3>
                <p className="text-slate-700 mb-6">
                  Consulta el mapa interactivo para ver todos los lotes disponibles y sus características.
                </p>
                <a
                  href="https://df60f4f7-4682-484e-92b2-e42ac976ab75-00-vi7lwl95uo43.kirk.replit.dev/public/b81cb0f0f3c7444a2f82b0df38a285c206ea55ee8bd58aefc0d6c56e42f5294e"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-emerald-700 transition"
                  data-testid="link-lotes-disponibles"
                >
                  Ver Lotes Disponibles
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            )}

            {/* Master Plan, Galería y Videos - Solo para Barrio Capinota */}
            {project.id === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Información del Proyecto</h2>
                
                {/* Tabs */}
                <div className="flex gap-2 border-b border-slate-200 mb-6">
                  <button
                    onClick={() => setActiveTab('master-plan')}
                    className={`px-4 py-2 font-semibold border-b-2 transition ${
                      activeTab === 'master-plan'
                        ? 'border-emerald-600 text-emerald-600'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                    data-testid="tab-master-plan"
                    type="button"
                  >
                    Master Plan
                  </button>
                  <button
                    onClick={() => setActiveTab('galeria')}
                    className={`px-4 py-2 font-semibold border-b-2 transition ${
                      activeTab === 'galeria'
                        ? 'border-emerald-600 text-emerald-600'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                    data-testid="tab-galeria"
                    type="button"
                  >
                    Galería de Imágenes
                  </button>
                  <button
                    onClick={() => setActiveTab('videos')}
                    className={`px-4 py-2 font-semibold border-b-2 transition ${
                      activeTab === 'videos'
                        ? 'border-emerald-600 text-emerald-600'
                        : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                    data-testid="tab-videos"
                    type="button"
                  >
                    Videos
                  </button>
                </div>

                {/* Contenido Master Plan */}
                {activeTab === 'master-plan' && (
                  <div className="space-y-4">
                    <div className="relative bg-slate-100 rounded-2xl overflow-hidden">
                      <div className="w-full h-96 bg-slate-200">
                        <img
                          src={masterPlanImages[currentMasterPlanIndex]}
                          alt={`Master Plan imagen ${currentMasterPlanIndex + 1}`}
                          className="w-full h-full object-contain"
                          data-testid={`img-master-plan-${currentMasterPlanIndex}`}
                        />
                      </div>

                      {/* Controles de navegación */}
                      <div className="absolute inset-0 flex items-center justify-between p-4">
                        <button
                          onClick={goToPreviousMasterPlan}
                          className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                          data-testid="button-prev-master-plan"
                          type="button"
                          aria-label="Imagen anterior"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={goToNextMasterPlan}
                          className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                          data-testid="button-next-master-plan"
                          type="button"
                          aria-label="Siguiente imagen"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </div>

                      {/* Botón expandir */}
                      <button
                        onClick={() => setMasterPlanFullscreen(true)}
                        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                        data-testid="button-expand-master-plan"
                        type="button"
                        aria-label="Expandir a pantalla completa"
                      >
                        <Expand className="w-5 h-5" />
                      </button>

                      {/* Indicador de posición */}
                      <div className="absolute bottom-4 left-0 right-0 text-center">
                        <span className="text-white text-sm font-semibold bg-black/50 px-3 py-1 rounded-full inline-block">
                          {currentMasterPlanIndex + 1} / {masterPlanImages.length}
                        </span>
                      </div>
                    </div>

                    {/* Miniaturas */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {masterPlanImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentMasterPlanIndex(idx)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                            idx === currentMasterPlanIndex ? 'border-emerald-600' : 'border-slate-200 hover:border-slate-300'
                          }`}
                          data-testid={`thumbnail-master-plan-${idx}`}
                          type="button"
                        >
                          <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contenido Galería */}
                {activeTab === 'galeria' && (
                  <div className="space-y-4">
                    <div className="relative bg-slate-100 rounded-2xl overflow-hidden">
                      <div className="w-full h-96 bg-slate-200">
                        <img
                          src={galeriaImages[currentGaleriaIndex]}
                          alt={`Galería imagen ${currentGaleriaIndex + 1}`}
                          className="w-full h-full object-cover"
                          data-testid={`img-galeria-${currentGaleriaIndex}`}
                        />
                      </div>

                      {/* Controles de navegación */}
                      <div className="absolute inset-0 flex items-center justify-between p-4">
                        <button
                          onClick={goToPreviousGaleria}
                          className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                          data-testid="button-prev-galeria"
                          type="button"
                          aria-label="Imagen anterior"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={goToNextGaleria}
                          className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                          data-testid="button-next-galeria"
                          type="button"
                          aria-label="Siguiente imagen"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </div>

                      {/* Botón expandir */}
                      <button
                        onClick={() => setGaleriaFullscreen(true)}
                        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                        data-testid="button-expand-galeria"
                        type="button"
                        aria-label="Expandir a pantalla completa"
                      >
                        <Expand className="w-5 h-5" />
                      </button>

                      {/* Indicador de posición */}
                      <div className="absolute bottom-4 left-0 right-0 text-center">
                        <span className="text-white text-sm font-semibold bg-black/50 px-3 py-1 rounded-full inline-block">
                          {currentGaleriaIndex + 1} / {galeriaImages.length}
                        </span>
                      </div>
                    </div>

                    {/* Miniaturas */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {galeriaImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentGaleriaIndex(idx)}
                          className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                            idx === currentGaleriaIndex ? 'border-emerald-600' : 'border-slate-200 hover:border-slate-300'
                          }`}
                          data-testid={`thumbnail-galeria-${idx}`}
                          type="button"
                        >
                          <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contenido Videos */}
                {activeTab === 'videos' && (
                  <div className="text-center py-12">
                    <p className="text-slate-600">Los videos del proyecto estará disponibles pronto</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
              {/* Datos clave */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Datos del proyecto</h3>
                
                {project.lotes && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Disponibilidad</p>
                    <p className="text-base font-semibold text-slate-900">{project.lotes}</p>
                  </div>
                )}

                {project.superficie && (
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Superficie total</p>
                    <p className="text-base font-semibold text-slate-900">{project.superficie}</p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Estado</p>
                  <p className="text-base font-semibold text-emerald-600">{project.etapa}</p>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-6 border-t border-slate-200 space-y-3">
                <a
                  href="https://wa.me/5491131298840"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-emerald-600 text-white font-semibold py-3 rounded-full text-center hover:bg-emerald-700 transition"
                  data-testid="link-whatsapp-project"
                >
                  Consultar por WhatsApp
                </a>
                <Link href="/#contacto" className="block w-full border border-emerald-600 text-emerald-700 font-semibold py-3 rounded-full text-center hover:bg-emerald-50 transition" data-testid="link-contact-project">
                  Enviar consulta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Fullscreen Master Plan */}
      {masterPlanFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setMasterPlanFullscreen(false)}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          data-testid="modal-fullscreen-master-plan"
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen */}
            <img
              src={masterPlanImages[currentMasterPlanIndex]}
              alt={`Master Plan imagen ${currentMasterPlanIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Botón cerrar */}
            <button
              onClick={() => setMasterPlanFullscreen(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition"
              data-testid="button-close-master-plan-fullscreen"
              type="button"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Controles de navegación */}
            <button
              onClick={() => {
                handleKeyDown({ key: 'ArrowLeft' } as React.KeyboardEvent);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition"
              data-testid="button-prev-master-plan-fullscreen"
              type="button"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={() => {
                handleKeyDown({ key: 'ArrowRight' } as React.KeyboardEvent);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition"
              data-testid="button-next-master-plan-fullscreen"
              type="button"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Indicador de posición */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <span className="text-white text-sm font-semibold bg-black/50 px-3 py-1 rounded-full inline-block">
                {currentMasterPlanIndex + 1} / {masterPlanImages.length}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal Fullscreen Galería */}
      {galeriaFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setGaleriaFullscreen(false)}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          data-testid="modal-fullscreen-galeria"
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen */}
            <img
              src={galeriaImages[currentGaleriaIndex]}
              alt={`Galería imagen ${currentGaleriaIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Botón cerrar */}
            <button
              onClick={() => setGaleriaFullscreen(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition"
              data-testid="button-close-galeria-fullscreen"
              type="button"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Controles de navegación */}
            <button
              onClick={() => {
                handleKeyDown({ key: 'ArrowLeft' } as React.KeyboardEvent);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition"
              data-testid="button-prev-galeria-fullscreen"
              type="button"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <button
              onClick={() => {
                handleKeyDown({ key: 'ArrowRight' } as React.KeyboardEvent);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition"
              data-testid="button-next-galeria-fullscreen"
              type="button"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Indicador de posición */}
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
