const About = () => {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Quiénes somos</h2>
          
          <p className="text-sm md:text-base text-slate-700 mb-4">
            HeyNidus es una empresa especializada en la comercialización de lotes de terrenos, integrando proyectos propios y de terceros. Nuestro propósito es simplificar y profesionalizar todo el proceso comercial, ofreciendo información clara y herramientas modernas para garantizar decisiones seguras y eficientes.
          </p>
          
          <p className="text-sm md:text-base text-slate-700 mb-4">
            Acompañamos a desarrolladores, propietarios de tierra, corredores inmobiliarios, compradores e inversores, brindándoles una estructura ordenada, comunicación efectiva y soluciones tecnológicas que impulsan la comercialización y mejoran la experiencia en cada etapa.
          </p>
          
          <p className="text-sm md:text-base text-slate-700 mb-6">
            Trabajamos junto a emprendimientos urbanísticos y proyectos en distintas fases de desarrollo, ayudándolos a convertirse en oportunidades reales de venta con procesos claros, trazabilidad y presentaciones profesionales.
          </p>
        </div>

        <div className="bg-emerald-50 rounded-lg p-6 md:p-8">
          <h3 className="text-xl font-semibold text-slate-900 mb-6">Pilares de nuestro servicio</h3>
          <ul className="space-y-3">
            <li className="flex gap-3 text-sm md:text-base text-slate-700">
              <span className="text-emerald-700 font-bold flex-shrink-0">•</span>
              <span>Seleccionamos proyectos con respaldo, trazabilidad y proyección real.</span>
            </li>
            <li className="flex gap-3 text-sm md:text-base text-slate-700">
              <span className="text-emerald-700 font-bold flex-shrink-0">•</span>
              <span>Explicamos condiciones técnicas y comerciales en lenguaje simple y directo.</span>
            </li>
            <li className="flex gap-3 text-sm md:text-base text-slate-700">
              <span className="text-emerald-700 font-bold flex-shrink-0">•</span>
              <span>Acompañamos a desarrolladores, propietarios y corredores con herramientas modernas que potencian sus ventas.</span>
            </li>
            <li className="flex gap-3 text-sm md:text-base text-slate-700">
              <span className="text-emerald-700 font-bold flex-shrink-0">•</span>
              <span>Facilitamos la conexión entre proyectos, compradores e inversores de manera transparente.</span>
            </li>
            <li className="flex gap-3 text-sm md:text-base text-slate-700">
              <span className="text-emerald-700 font-bold flex-shrink-0">•</span>
              <span>Construimos relaciones duraderas basadas en claridad, cumplimiento y confianza.</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Nuestra solución</h3>
          <p className="text-sm md:text-base text-slate-700 mb-6">
            Transformamos la comercialización y búsqueda de lotes en un proceso ordenado, guiado y seguro.
            En vez de recorrer proyectos sin información clara, te mostramos opciones filtradas, bien evaluadas y te acompañamos en cada decisión con herramientas modernas y comunicación directa.
          </p>
          
          <h4 className="text-lg font-semibold text-slate-900 mb-4">¿Qué hacemos por vos?</h4>
          <ul className="space-y-3">
            <li className="flex gap-3 text-sm md:text-base text-slate-700">
              <span className="text-emerald-600 font-bold flex-shrink-0">✔</span>
              <span>Escuchamos tu objetivo: vivir, invertir, desarrollar o comercializar un proyecto.</span>
            </li>
            <li className="flex gap-3 text-sm md:text-base text-slate-700">
              <span className="text-emerald-600 font-bold flex-shrink-0">✔</span>
              <span>Te presentamos proyectos analizados y alineados a tu perfil, según tu necesidad y etapa del proceso.</span>
            </li>
            <li className="flex gap-3 text-sm md:text-base text-slate-700">
              <span className="text-emerald-600 font-bold flex-shrink-0">✔</span>
              <span>Explicamos ubicación, condiciones y evolución del emprendimiento con información simple y accionable.</span>
            </li>
            <li className="flex gap-3 text-sm md:text-base text-slate-700">
              <span className="text-emerald-600 font-bold flex-shrink-0">✔</span>
              <span>Coordinamos visitas, reservas y pasos administrativos para que avances sin trabas.</span>
            </li>
            <li className="flex gap-3 text-sm md:text-base text-slate-700">
              <span className="text-emerald-600 font-bold flex-shrink-0">✔</span>
              <span>Acompañamos a desarrolladores, propietarios y corredores con procesos profesionales que potencian ventas y ordenan la comercialización.</span>
            </li>
            <li className="flex gap-3 text-sm md:text-base text-slate-700">
              <span className="text-emerald-600 font-bold flex-shrink-0">✔</span>
              <span>Mantenemos un canal abierto de comunicación antes, durante y después de cada operación.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
