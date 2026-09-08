import { ArrowRight, BadgeCheck, FileCheck2, Gauge, MapPinned, Radar, ShieldCheck, UsersRound } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Nosotros | MAPE",
  description: "Conoce a S&E MAPE E.I.R.L., empresa arequipeña de transporte y servicios especializados.",
};

const values = [
  ["Cumplimiento", "Normativa aplicable al sector minero y estándares de seguridad exigidos por cada cliente.", FileCheck2],
  ["Unidades preparadas", "Unidades operativas preparadas para procesos de homologación con compañías mineras e industriales.", BadgeCheck],
  ["Mejora continua", "Enfoque en la calidad del servicio, alineado con estándares internacionales como ISO 9001:2015.", Gauge],
  ["Personal capacitado", "Experiencia en operaciones de campo y atención de servicios de alta exigencia.", UsersRound],
  ["Cobertura nacional", "Capacidad operativa para atender los requerimientos de nuestros clientes a nivel nacional.", MapPinned],
  ["Trazabilidad", "Monitoreo mediante GPS y cámaras de videovigilancia para mayor control y seguridad.", Radar],
  ["Reducción de riesgos", "Decisiones orientadas a la eficiencia operativa y la prevención en cada servicio.", ShieldCheck],
] as const;

export default function AboutPage() {
  return (
    <main className="bg-[#f7f5f1] text-dark">
      <section className="relative flex min-h-[34rem] items-end overflow-clip rounded-b-xl bg-[#263e42] px-[var(--spacing-gutter)] pb-12 pt-28 text-white md:min-h-[43rem] md:pb-16">
        <div className="absolute inset-0 overflow-clip">
          <video
            className="h-[112%] w-full object-cover"
            src="https://res.cloudinary.com/demzflxgq/video/upload/v1788380445/15651883_1920_1080_60fps_s4lntf.mp4"
            autoPlay
            muted
            loop
            playsInline
            data-parallax="trigger"
            data-parallax-start="-6"
            data-parallax-end="6"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="relative mx-auto w-full max-w-[120rem]" data-animate="stagger-up">
          <p className="eyebrow" data-animate="stagger-up-item">Quiénes somos</p>
          <h1 className="mt-5 max-w-[12ch] text-[clamp(3rem,6.5vw,7rem)] leading-[0.91]" data-animate="stagger-up-item">Experiencia que acompaña cada ruta.</h1>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/90" data-animate="stagger-up-item">Somos una empresa arequipeña especializada en transporte y servicios operativos para los sectores minero, construcción e industria.</p>
        </div>
      </section>

      <section className="px-[var(--spacing-gutter)] py-20 md:py-28">
        <div className="mx-auto grid max-w-[120rem] gap-12 lg:grid-cols-[minmax(13rem,0.44fr)_1fr]">
          <p className="eyebrow">Quiénes somos</p>
          <div className="grid gap-10 lg:grid-cols-[1fr_minmax(17rem,0.8fr)] lg:items-start" data-animate="stagger-up">
            <div>
              <h2 className="text-[length:var(--text-fluid-h2)]" data-animate="stagger-up-item">Una empresa arequipeña que conoce la operación.</h2>
              <p className="mt-8 max-w-2xl text-base leading-relaxed" data-animate="stagger-up-item">Somos S&amp;E MAPE E.I.R.L., una empresa arequipeña con más de 4 años de experiencia en el sector de transporte y servicios especializados. Nos especializamos en brindar soluciones integrales en alquiler de vehículos livianos y pesados, supervisión y escolta en ruta, y transporte terrestre de mercancías, atendiendo principalmente a los sectores minero, de construcción e industrial a nivel nacional.</p>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-dark/75" data-animate="stagger-up-item">Nos distinguimos por nuestro compromiso con la seguridad, la eficiencia operativa y el cumplimiento de los más altos estándares de calidad, adaptándonos a los requerimientos específicos de cada cliente y contribuyendo al desarrollo seguro y oportuno de sus operaciones.</p>
            </div>
            <div className="relative overflow-hidden rounded-lg p-6 text-white md:p-8" data-animate="stagger-up-item"><img src="https://res.cloudinary.com/demzflxgq/image/upload/f_auto,q_auto,w_1600/v1788539055/agent_generate_image_-_A_rugged_4x4_double-cab_pickup_truck__styled_like_a_Toyota_H__fx8nft.png" alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" /><div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/75"></div><div className="relative"><p className="u-text-small-caps text-white/75">Nuestro enfoque</p><p className="mt-8 text-2xl leading-tight">Seguridad, eficiencia operativa y calidad en cada decisión.</p><div className="mt-16 border-t border-white/35 pt-4 text-sm text-white/80">Contribuimos al desarrollo seguro y oportuno de las operaciones de nuestros clientes.</div></div></div>
          </div>
        </div>
      </section>

      <section className="bg-brand px-[var(--spacing-gutter)] py-16 text-white md:py-24">
        <div className="mx-auto max-w-[120rem]" data-animate="stagger-up"><p className="text-[clamp(2.25rem,5vw,5.4rem)] leading-[0.98]" data-animate="stagger-up-item">No solo movemos carga. Sostenemos la continuidad de cada operación.</p></div>
      </section>

      <section className="px-[var(--spacing-gutter)] py-20 md:py-28">
        <div className="mx-auto grid max-w-[120rem] gap-12 lg:grid-cols-[minmax(13rem,0.44fr)_1fr]">
          <p className="eyebrow">Propósito</p>
          <div className="grid gap-4 md:grid-cols-2" data-animate="stagger-up">
            <article className="border border-dark/25 p-7 md:p-9" data-animate="stagger-up-item"><p className="u-text-small-caps text-brand">Misión</p><h2 className="mt-6 text-[length:var(--text-fluid-h3)]">Servicios que cumplen.</h2><p className="mt-6 text-base leading-relaxed text-dark/80">Brindar servicios integrales de alquiler de vehículos, supervisión y escolta en ruta, y transporte terrestre de carga, cumpliendo con altos estándares de calidad, seguridad y eficiencia, con el propósito de satisfacer las necesidades de los sectores.</p></article>
            <article className="bg-dark p-7 text-white md:p-9" data-animate="stagger-up-item"><p className="u-text-small-caps text-white/60">Visión</p><h2 className="mt-6 text-[length:var(--text-fluid-h3)]">Un socio estratégico confiable.</h2><p className="mt-6 text-base leading-relaxed text-white/80">Consolidarnos como una empresa líder en servicios de alquiler, supervisión, escolta y transporte especializado, posicionándonos como un socio estratégico confiable para las principales empresas del país, siendo reconocidos por nuestra experiencia, compromiso operativo, seguridad y excelencia.</p></article>
          </div>
        </div>
      </section>

      <section className="px-[var(--spacing-gutter)] py-20 md:py-28">
        <div className="mx-auto grid max-w-[120rem] gap-12 lg:grid-cols-[minmax(13rem,0.44fr)_1fr]">
          <div data-animate="stagger-up"><p className="eyebrow" data-animate="stagger-up-item">Propuesta de valor</p><h2 className="mt-7 text-[length:var(--text-fluid-h2)]" data-animate="stagger-up-item">Respaldo para operar con confianza.</h2><p className="mt-6 max-w-xs text-sm leading-relaxed text-dark/70" data-animate="stagger-up-item">Un servicio basado en seguridad, confiabilidad y continuidad operativa.</p></div>
          <div className="border-t border-dark/35" data-animate="stagger-up">
            {values.map(([title, description, Icon], index) => <article className="grid gap-4 border-b border-dark/35 py-6 md:grid-cols-[2rem_minmax(10rem,0.6fr)_1fr] md:items-start" data-animate="stagger-up-item" key={title}><Icon className="h-6 w-6 text-brand" strokeWidth={1.4} /><h3 className="text-xl">{String(index + 1).padStart(2, "0")} · {title}</h3><p className="text-sm leading-relaxed text-dark/75">{description}</p></article>)}
          </div>
        </div>
      </section>

      <section className="px-[var(--spacing-gutter)] py-20 md:py-28">
        <div className="mx-auto grid max-w-[120rem] gap-12 lg:grid-cols-[minmax(13rem,0.44fr)_1fr]">
          <p className="eyebrow">Compromiso</p>
          <div className="max-w-4xl" data-animate="stagger-up"><h2 className="text-[length:var(--text-fluid-h2)]" data-animate="stagger-up-item">Un aliado que responde cuando la operación lo exige.</h2><p className="mt-7 text-base leading-relaxed" data-animate="stagger-up-item">Trabajamos para ser un aliado estratégico confiable, garantizando operaciones seguras, eficientes y alineadas con las exigencias de cada cliente. Brindamos soluciones oportunas y especializadas que aportan valor, minimizan riesgos y fortalecen la continuidad operativa de las organizaciones a las que servimos.</p><Link className="button_main mt-9" href="/contacto">Conversemos sobre tu operación<span className="button_main_icon"><ArrowRight /></span></Link></div>
        </div>
      </section>
    </main>
  );
}
