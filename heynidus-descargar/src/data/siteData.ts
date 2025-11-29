export type ProjectType = 'Proyecto propio' | 'Proyecto de terceros';

export interface Project {
  id: number;
  nombre: string;
  tipo: ProjectType;
  ubicacion: string;
  descripcion: string;
  imagen: string;
  etapa: string;
  caracteristicas?: string[];
  superficie?: string;
  lotes?: string;
  servicios?: string[];
  amenidades?: string[];
  detalleCompleto?: string;
}

export interface BlogPost {
  id: number;
  titulo: string;
  fecha: string;
  resumen: string;
  imagen: string;
}

export interface Testimonial {
  id: number;
  contenido: string;
  autor: string;
  rol: string;
  imagen: string;
}

export const projects: Project[] = [
  {
    id: 1,
    nombre: 'Barrio Capinota',
    tipo: 'Proyecto de terceros',
    ubicacion: 'Partido de Merlo',
    descripcion:
      'Barrio abierto con 210 lotes de 300 m² cada uno. Preventa de 30 lotes con el mejor precio del mercado. Ventas por etapas.',
    imagen: 'barrio_capinota_real.jpg',
    etapa: 'Preventa',
    superficie: '63.000 m²',
    lotes: '30 lotes en preventa',
    caracteristicas: [
      '210 lotes totales de 300 m² (10m x 30m)',
      'Master plan de 210 lotes con acceso optimizado',
      'Calles amplias, uniformes y bien distribuidas',
      'Diseño urbano moderno con concepto de orden y funcionalidad',
      'Oportunidad exclusiva: 30 lotes en preventa con mejor precio del mercado',
      'Ventas por etapas con excelente proyección de valorización',
    ],
    servicios: ['Agua potable', 'Electricidad', 'Acceso principal'],
    amenidades: ['Áreas recreativas', 'Plaza con juegos para niños', 'Espacios verdes', 'Circulaciones amplias'],
    detalleCompleto: 'Barrio Capinota es un proyecto residencial de magnitud en el Partido de Merlo, con 210 lotes de 300 m² cada uno (10m de frente x 30m de fondo). El master plan responde a un concepto de orden, armonía y funcionalidad. Actualmente se abre la preventa exclusiva con 30 lotes disponibles a los mejores precios del mercado. El proyecto contempla amenidades completas con áreas recreativas, plaza con juegos para niños, y servicios básicos (agua, electricidad, acceso principal). Las ventas se realizarán por etapas, permitiendo a los interesados acceso a vivienda con excelente proyección inmobiliaria.',
  },
  {
    id: 2,
    nombre: 'Altos Valles de Glew',
    tipo: 'Proyecto de terceros',
    ubicacion: 'Partido de Glew',
    descripcion: 'Próximamente',
    imagen: 'altos_valles_glew_lots.png',
    etapa: 'Próximamente',
  },
  {
    id: 3,
    nombre: 'Altos de Cañuela',
    tipo: 'Proyecto de terceros',
    ubicacion: 'Partido de Cañuelas',
    descripcion:
      'Próximamente. Lotes diseñados para familias que buscan espacio, verde y entorno en desarrollo.',
    imagen: 'alto_de_cañuela_lots.png',
    etapa: 'Próximamente',
    superficie: '18.000 m²',
    lotes: '52 lotes',
    caracteristicas: [
      'Lotes amplios con mucho espacio',
      'Entorno rural pero con servicios',
      'Ideales para familias grandes',
      'Proyección de urbanización futura',
    ],
    servicios: ['Acceso principal planificado', 'Servicios a proyectar'],
    amenidades: ['Mucha vegetación', 'Conexión con naturaleza', 'Potencial de desarrollo'],
    detalleCompleto: 'Altos de Cañuela es un proyecto próximo a lanzarse en el Partido de Cañuelas, pensado para familias que buscan amplitud y contacto con la naturaleza. Los lotes son de gran superficie, perfectos para construir casas con jardines amplios. El entorno tiene una vocación rural pero con planes de urbanización futura, lo que convierte a este proyecto en una excelente inversión a largo plazo.',
  },
  {
    id: 4,
    nombre: 'Valles del Pino',
    tipo: 'Proyecto de terceros',
    ubicacion: 'Partido de La Matanza',
    descripcion: 'Próximamente',
    imagen: 'flat_agricultural_field_la_matanza.png',
    etapa: 'Próximamente',
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    titulo: 'Escapar del ruido de la ciudad: cómo lograr tu propia paz',
    fecha: '15 de noviembre de 2025',
    resumen:
      'El estrés de la ciudad no tiene que ser permanente. Descubre cómo tener tu propio lote en un entorno natural te permite desconectarte, vivir con tranquilidad y construir una mejor calidad de vida para ti y tu familia.',
    imagen: 'peaceful_nature_escape_landscape.png',
  },
  {
    id: 2,
    titulo: 'Tu propio lote: libertad para construir tu vida a tu manera',
    fecha: '3 de noviembre de 2025',
    resumen:
      'Poseer un lote propio es más que una inversión: es la libertad de elegir cómo vivir. Desde la construcción del hogar hasta la forma en que convives con la naturaleza, cada decisión es tuya.',
    imagen: 'own_plot_of_land_freedom.png',
  },
  {
    id: 3,
    titulo: 'Vivir en naturaleza sin renunciar a servicios y comodidad',
    fecha: '25 de octubre de 2025',
    resumen:
      'El equilibrio perfecto existe: acceso a servicios, conectividad, buena infraestructura y al mismo tiempo espacios verdes, aire puro y la tranquilidad que solo la naturaleza ofrece. Te contamos cómo es posible.',
    imagen: 'nature_with_modern_services.png',
  },
  {
    id: 4,
    titulo: '5 razones para invertir en un lote ahora',
    fecha: '10 de octubre de 2025',
    resumen:
      'El mercado inmobiliario ofrece oportunidades únicas. Descubre por qué invertir en lotes es una decisión inteligente: revalorización, libertad de construcción, demanda creciente, acceso a naturaleza y potencial económico.',
    imagen: 'investment_real_estate_opportunity.png',
  },
  {
    id: 5,
    titulo: '¿Qué significa comprar en pozo un lote de terreno?',
    fecha: '25 de septiembre de 2025',
    resumen:
      'Comprar en pozo implica etapas, plazos y condiciones específicas. Explicamos el concepto con ejemplos simples y concretos para que tomes la mejor decisión de inversión.',
    imagen: 'pre_construction_property_development.png',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 1,
    contenido: 'Encontramos el equilibrio perfecto entre tranquilidad y crecimiento. Es un proyecto pensado para vivir bien, con espacios verdes y una planificación clara.',
    autor: 'María & Joaquín',
    rol: 'Familia joven',
    imagen: 'casual_young_couple_natural.png',
  },
  {
    id: 2,
    contenido: 'Buscábamos nuestro primer lote y queríamos algo seguro y transparente. El proceso fue sencillo, la atención excelente y el proyecto tiene un potencial enorme.',
    autor: 'Sofía & Martín',
    rol: 'Primera inversión',
    imagen: 'casual_young_woman_natural.png',
  },
  {
    id: 3,
    contenido: 'Me convenció la ubicación y la proyección de la zona. Es una oportunidad real de invertir donde todavía hay margen de crecimiento, pero con un plan serio detrás.',
    autor: 'Diego',
    rol: 'Ingeniero',
    imagen: 'casual_man_natural_portrait.png',
  },
  {
    id: 4,
    contenido: 'Lo que más me llamó la atención fue el orden del master plan: calles amplias, lotes bien distribuidos y una visión urbana responsable. Da confianza.',
    autor: 'Laura',
    rol: 'Arquitecta',
    imagen: 'casual_woman_natural_portrait.png',
  },
  {
    id: 5,
    contenido: 'Queríamos un lugar más tranquilo y seguro para nuestros hijos. Nos gustó el entorno, los accesos y la comunidad que se está formando.',
    autor: 'Familia Rodríguez',
    rol: 'Familia que busca mudarse',
    imagen: 'family_candid_outdoor_portrait.png',
  },
  {
    id: 6,
    contenido: 'Vengo comprando terrenos hace años y este desarrollo destaca por su calidad y su proyección. Tiene un excelente potencial de revalorización a mediano plazo.',
    autor: 'Pablo',
    rol: 'Inversor',
    imagen: 'mature_man_casual_natural.png',
  },
  {
    id: 7,
    contenido: 'Se siente diferente. Hay verde, amplitud y una armonía que no se encuentra en cualquier barrio. Ideal para desconectarse y vivir con más calma.',
    autor: 'Carolina',
    rol: 'Orientada al bienestar',
    imagen: 'woman_nature_casual_portrait.png',
  },
  {
    id: 8,
    contenido: 'Lo que más valoro es la tranquilidad. El proyecto plantea estándares altos de seguridad y una comunidad organizada. Eso fue clave para tomar la decisión.',
    autor: 'Gustavo',
    rol: 'Enfocado en seguridad',
    imagen: 'man_casual_friendly_natural.png',
  },
  {
    id: 9,
    contenido: 'Comparamos varios proyectos y este fue el más coherente en precio, ubicación y desarrollo. No solo es comprar un terreno, es proyectar futuro con bases sólidas.',
    autor: 'Rodrigo',
    rol: 'Comprador racional',
    imagen: 'man_outdoor_casual_natural.png',
  },
  {
    id: 10,
    contenido: 'Queríamos nuestro primer lugar propio y este proyecto nos dio una oportunidad real. Buena financiación, buena atención y un entorno que nos encanta.',
    autor: 'Ana & Tomás',
    rol: 'Pareja joven',
    imagen: 'couple_casual_happy_natural.png',
  },
];
