import React, { useState } from 'react';

interface FormState {
  nombre: string;
  email: string;
  telefono: string;
  tipoConsulta: string;
  mensaje: string;
  aceptaPolitica: boolean;
}

const initialFormState: FormState = {
  nombre: '',
  email: '',
  telefono: '',
  tipoConsulta: '',
  mensaje: '',
  aceptaPolitica: false,
};

const ContactSection = () => {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.nombre || !form.email || !form.telefono || !form.tipoConsulta || !form.mensaje) {
      setError('Revisá los datos ingresados. Algunos campos son obligatorios para poder ayudarte mejor.');
      return;
    }

    if (!form.aceptaPolitica) {
      setError('Debés aceptar la política de privacidad para continuar.');
      return;
    }

    const whatsappMessage = `Hola HeyNidus! 📋

Soy ${form.nombre}
Email: ${form.email}
Teléfono: ${form.telefono}

Tipo de consulta: ${form.tipoConsulta}

Mensaje: ${form.mensaje}`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/5491131298840?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');

    console.log('Formulario enviado a WhatsApp:', form);

    setSuccess('¡Gracias por contactarte con HeyNidus! Se abrió WhatsApp para que completes tu consulta. En breve un asesor se comunicará con vos.');
    setForm(initialFormState);

    setTimeout(() => setSuccess(null), 5000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Formulario */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Hablemos sobre tu próximo lote</h2>
          <p className="text-sm md:text-base text-slate-700 mb-6">
            Completá el formulario y contanos qué tipo de lote estás buscando. Nuestro equipo te va a responder con
            opciones concretas y claras, sin compromiso.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-emerald-700">{success}</p>}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="nombre">
                Nombre completo *
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="email">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="telefono">
                  Teléfono *
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  value={form.telefono}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="tipoConsulta">
                Tipo de consulta *
              </label>
              <select
                id="tipoConsulta"
                name="tipoConsulta"
                value={form.tipoConsulta}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              >
                <option value="">Seleccioná una opción</option>
                <option value="comprar">Quiero comprar</option>
                <option value="invertir">Quiero invertir</option>
                <option value="comercializar">Quiero comercializar mi proyecto</option>
                <option value="otra">Otra consulta</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1" htmlFor="mensaje">
                Mensaje *
              </label>
              <textarea
                id="mensaje"
                name="mensaje"
                value={form.mensaje}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                id="aceptaPolitica"
                name="aceptaPolitica"
                type="checkbox"
                checked={form.aceptaPolitica}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
              />
              <label htmlFor="aceptaPolitica" className="text-xs text-slate-700">
                Acepto la política de privacidad y autorizo a HeyNidus a contactarme para brindarme información sobre
                proyectos y lotes disponibles.
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800 transition"
            >
              Enviar consulta
            </button>
          </form>
        </div>

        {/* Contacto y ubicación */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Contacto y ubicación</h3>
            <p className="text-sm text-slate-700 mb-3">
              Si preferís un contacto directo, también podés escribirnos o visitarnos en nuestra oficina comercial.
            </p>
            <ul className="space-y-1 text-sm text-slate-700">
              <li>
                <span className="font-semibold">Email:</span> ventas@heynidus.com
              </li>
              <li>
                <span className="font-semibold">Teléfono:</span> +54 9 11 3129-8840
              </li>
              <li>
                <span className="font-semibold">Horario:</span> Lunes a viernes, de 9:00 a 18:00 hs.
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-slate-700 font-semibold">Oficina comercial HeyNidus</p>
            <p className="text-sm text-slate-700">
              Av. Olivera 1561,
              <br />
              C1407 Cdad. Autónoma de Buenos Aires
            </p>
            <div className="mt-3 h-40 rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3282.5589947839396!2d-58.39876!3d-34.66289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcce8f8d8d8d8d%3A0x8d8d8d8d8d8d8d8d!2sAv.%20Olivera%201561%2C%20C1407%20CABA!5e0!3m2!1ses!2sar!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <div>
            <a
              href="https://wa.me/5491131298840"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition"
              data-testid="link-whatsapp"
            >
              <span>Escríbenos por WhatsApp</span>
            </a>
            <p className="mt-2 text-xs text-slate-500">
              Te respondemos durante nuestro horario de atención para ayudarte a encontrar el lote adecuado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
