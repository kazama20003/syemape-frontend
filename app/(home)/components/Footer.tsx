import Link from "next/link";

export default function Footer() {
  return (
    <footer className="u-theme-dark u-container bg-dark pb-7 pt-20 md:pt-28">
      <div className="grid gap-16 border-b border-white/20 pb-16 lg:grid-cols-[1.25fr_1.8fr_0.8fr_0.7fr] lg:gap-10">
        <div>
          <p className="text-sm font-bold">Mantente informado</p>
          <form className="mt-5 flex max-w-md gap-3" action="#">
            <label className="sr-only" htmlFor="footer-email">Correo electrónico</label>
            <input id="footer-email" type="email" placeholder="correo@empresa.com" className="h-11 min-w-0 flex-1 rounded-sm border border-white/45 bg-transparent px-4 text-sm placeholder:text-white/45 focus:border-white focus:outline-none" />
            <button type="submit" className="h-11 rounded-sm bg-white px-5 text-sm text-dark transition-colors hover:bg-white/80">Suscribirme</button>
          </form>
          <div className="mt-16">
            <p className="text-sm font-bold">Síguenos en</p>
            <div className="mt-4 flex gap-3">
              <a className="grid h-10 w-10 place-items-center rounded-full border border-white/45 transition-colors hover:bg-white hover:text-dark" href="#" aria-label="Facebook"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V8z" /></svg></a>
              <a className="grid h-10 w-10 place-items-center rounded-full border border-white/45 transition-colors hover:bg-white hover:text-dark" href="#" aria-label="LinkedIn"><svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 9h4v11H4zM6 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h4v1.6c.7-1 2-1.9 3.8-1.9 3.5 0 4.2 2.3 4.2 5.3V20h-4v-5.2c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V20h-4z" /></svg></a>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold">Contacto directo</p>
          <a className="mt-5 block text-xl transition-colors hover:text-white/70" href="tel:+51990297657">+51 990 297 657</a>
          <a className="mt-2 block text-sm text-white/75 transition-colors hover:text-white" href="mailto:se.mape.eirl@gmail.com">se.mape.eirl@gmail.com</a>
          <p className="mt-12 max-w-sm text-sm leading-relaxed text-white/70">Transporte, alquiler de vehículos, supervisión y escolta en ruta para minería, construcción e industria.</p>
        </div>

        <div>
          <p className="u-text-small-caps text-white/55">Mapa del sitio</p>
          <nav className="mt-5 flex flex-col gap-3 text-sm" aria-label="Mapa del sitio">
            <Link href="/" className="hover:text-white/65">Inicio</Link>
            <Link href="/nosotros" className="hover:text-white/65">Nosotros</Link>
            <Link href="/servicios" className="hover:text-white/65">Servicios</Link>
            <Link href="/contacto" className="hover:text-white/65">Contacto</Link>
          </nav>
        </div>

        <div>
          <p className="u-text-small-caps text-white/55">Operación</p>
          <div className="mt-5 space-y-3 text-sm text-white/75">
            <p>Arequipa, Perú</p>
            <p>Cobertura nacional</p>
            <p>Atención a proyectos de alta exigencia</p>
          </div>
        </div>
      </div>

      <div className="flex min-h-56 flex-col justify-between gap-10 pt-12 md:min-h-72 md:pt-16">
        <span className="font-heading text-[clamp(5rem,14vw,13rem)] leading-[0.68] tracking-[-0.07em]">mape.</span>
        <div className="flex flex-wrap justify-between gap-4 border-t border-white/20 pt-5 text-xs text-white/45">
          <p>© 2026 S&amp;E MAPE E.I.R.L. Todos los derechos reservados.</p>
          <p>Supervisión con experiencia para rutas seguras.</p>
        </div>
      </div>
    </footer>
  );
}
