import { ArrowUpRight, Mail, Phone } from "lucide-react";

export const metadata = {
  title: "Contacto | MAPE",
  description: "Comunícate con S&E MAPE E.I.R.L. para supervisión y transporte especializado.",
};

export default function ContactPage() {
  return (
    <main className="bg-[#f7f5f1] text-dark">
      <section className="grid min-h-[100svh] lg:grid-cols-[minmax(23rem,1fr)_minmax(35rem,1fr)]">
        <div className="relative m-3 min-h-[34rem] overflow-hidden rounded-lg bg-[#263e42] text-white lg:m-4 lg:mr-0">
          <img
            src="https://res.cloudinary.com/demzflxgq/image/upload/f_auto,q_auto,w_1600/v1788539055/agent_generate_image_-_A_rugged_4x4_double-cab_pickup_truck__styled_like_a_Toyota_H__fx8nft.png"
            alt="Camioneta 4x4 de S&E MAPE"
            className="absolute inset-0 h-full w-full object-cover object-[60%_center]"
            loading="eager"
            data-animate="scale-in"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/25"></div>
          <div className="relative flex h-full min-h-[34rem] flex-col justify-end p-6 md:p-10 lg:p-14" data-animate="stagger-up">
            <p className="eyebrow" data-animate="stagger-up-item">S&amp;E MAPE E.I.R.L.</p>
            <h1 className="mt-5 max-w-[13ch] text-[clamp(2.5rem,5vw,5.5rem)] leading-[0.94]" data-animate="stagger-up-item">Rutas seguras, decisiones claras.</h1>
            <p className="mt-7 max-w-sm text-sm leading-relaxed text-white/90" data-animate="stagger-up-item">SUPERVISIÓN CON EXPERIENCIA PARA RUTAS SEGURAS</p>
          </div>
        </div>

        <div className="flex items-center px-[var(--spacing-gutter)] py-28 lg:px-[clamp(3rem,7vw,8rem)]">
          <div className="w-full max-w-3xl" data-animate="stagger-up">
            <p className="eyebrow text-brand" data-animate="stagger-up-item">Contacto</p>
            <h2 className="mt-5 text-[length:var(--text-fluid-h2)]" data-animate="stagger-up-item">Cuéntanos sobre tu operación.</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-dark/70" data-animate="stagger-up-item">Nuestro equipo te responderá para coordinar el servicio de transporte, escolta o supervisión que necesitas.</p>

            <form className="mt-10 grid gap-x-7 gap-y-6 sm:grid-cols-2" data-animate="stagger-up-item">
              <label className="contact-field">Nombre completo<input required name="name" autoComplete="name" placeholder="Escribe tu nombre" /></label>
              <label className="contact-field">Empresa<input name="company" autoComplete="organization" placeholder="Nombre de la empresa" /></label>
              <label className="contact-field">Correo electrónico<input required type="email" name="email" autoComplete="email" placeholder="correo@empresa.com" /></label>
              <label className="contact-field">Teléfono<input required type="tel" name="phone" autoComplete="tel" placeholder="+51 000 000 000" /></label>
              <label className="contact-field sm:col-span-2">Servicio requerido<select name="service" defaultValue=""><option value="" disabled>Selecciona una opción</option><option>Transporte de carga</option><option>Escolta en ruta</option><option>Alquiler de vehículos</option><option>Supervisión de operaciones</option></select></label>
              <label className="contact-field sm:col-span-2">Mensaje<textarea name="message" rows={3} placeholder="Describe brevemente tu requerimiento" /></label>
              <button className="button_main mt-2 w-fit" type="submit">Enviar consulta <span className="button_main_icon"><ArrowUpRight /></span></button>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-brand px-[var(--spacing-gutter)] py-12 text-white md:py-16">
        <div className="mx-auto grid max-w-[120rem] gap-10 border-y border-white/35 py-8 md:grid-cols-[1fr_1fr_1.4fr] md:gap-8" data-animate="stagger-up">
          <div data-animate="stagger-up-item"><p className="u-text-small-caps text-white/65">Contacto directo</p><a className="mt-3 flex items-center gap-2 text-lg hover:text-white/70" href="tel:+51990297657"><Phone size={17} />+51 990 297 657</a><a className="mt-2 flex items-center gap-2 text-sm text-white/85 hover:text-white" href="mailto:se.mape.eirl@gmail.com"><Mail size={16} />se.mape.eirl@gmail.com</a></div>
          <div data-animate="stagger-up-item"><p className="u-text-small-caps text-white/65">Síguenos en</p><div className="mt-3 flex gap-3"><a className="grid h-9 w-9 place-items-center rounded-full border border-white/50 hover:bg-white hover:text-brand" href="#" aria-label="Facebook"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V8z" /></svg></a><a className="grid h-9 w-9 place-items-center rounded-full border border-white/50 hover:bg-white hover:text-brand" href="#" aria-label="LinkedIn"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 9h4v11H4zM6 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h4v1.6c.7-1 2-1.9 3.8-1.9 3.5 0 4.2 2.3 4.2 5.3V20h-4v-5.2c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V20h-4z" /></svg></a></div></div>
          <p className="max-w-md text-sm leading-relaxed text-white/85" data-animate="stagger-up-item">Atendemos requerimientos de minería, construcción e industria con una operación enfocada en seguridad y continuidad.</p>
        </div>
      </section>
    </main>
  );
}
