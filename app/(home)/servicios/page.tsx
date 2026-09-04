import { ArrowRight, CarFront, Check, FileCheck2, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Servicios | MAPE",
  description: "Servicios de transporte, escolta y supervisión especializada de S&E MAPE E.I.R.L.",
};

const services = [
  {
    number: "01",
    title: "Alquiler de vehículos livianos y pesados",
    items: ["Camionetas 4x4 para operaciones mineras, proyectos y servicios en campo.", "Flota pesada: tractocamiones, camiones grúa y unidades especiales."],
    Icon: CarFront,
    color: "bg-[#41577e]",
    media: { type: "image", src: "https://res.cloudinary.com/demzflxgq/image/upload/v1788539055/agent_generate_image_-_A_rugged_4x4_double-cab_pickup_truck__styled_like_a_Toyota_H__fx8nft.png" },
  },
  {
    number: "02",
    title: "Servicios de transporte terrestre",
    items: ["Transporte de mercancías a nivel nacional.", "Transporte de materiales peligrosos (MATPEL).", "Transporte de carga sobredimensionada."],
    Icon: Truck,
    color: "bg-brand",
    media: { type: "video", src: "https://res.cloudinary.com/demzflxgq/video/upload/v1788385315/16352581_2560_1440_60fps_jgr9ib.mp4" },
  },
  {
    number: "03",
    title: "Supervisión, escolta y resguardo en ruta",
    items: ["Supervisión de rutas.", "Escolta de carga sobredimensionada.", "Resguardo de carga.", "Piloteo de convoyes y mercancías, incluyendo la señalización para MATPEL."],
    Icon: ShieldCheck,
    color: "bg-[#263e42]",
    media: { type: "video", src: "https://res.cloudinary.com/demzflxgq/video/upload/v1788380445/15651883_1920_1080_60fps_s4lntf.mp4" },
  },
] as const;

const valuePoints = [
  "Cumplimiento de la normativa aplicable al sector minero y de los estándares de seguridad exigidos por nuestros clientes.",
  "Unidades operativas preparadas para procesos de homologación con compañías mineras y del sector industrial.",
  "Enfoque en la calidad del servicio y la mejora continua, alineado con estándares internacionales como ISO 9001:2015.",
  "Personal capacitado, con experiencia en operaciones de campo y en la atención de servicios de alta exigencia.",
  "Cobertura operativa a nivel nacional.",
  "Monitoreo mediante GPS y cámaras de videovigilancia, para mayor control, trazabilidad y seguridad.",
  "Orientación a la eficiencia operativa y a la reducción de riesgos en cada servicio.",
];

const policies = ["Póliza Multiriesgo", "Póliza Robo y/o Asalto", "Póliza Responsabilidad Civil", "Póliza Vehicular", "Póliza Transporte"];

export default function ServicesPage() {
  return (
    <main className="bg-[#f7f5f1] text-dark">
      <section className="relative flex min-h-[34rem] items-end overflow-clip bg-[#41577e] px-[var(--spacing-gutter)] pb-12 pt-28 text-white md:min-h-[42rem] md:pb-16">
        <div className="absolute inset-0 overflow-clip">
          <img
            src="https://res.cloudinary.com/demzflxgq/image/upload/v1788539055/agent_generate_image_-_A_rugged_4x4_double-cab_pickup_truck__styled_like_a_Toyota_H__fx8nft.png"
            alt="Camioneta 4x4 de S&E MAPE para operaciones mineras"
            className="h-[112%] w-full object-cover object-[72%_center]"
            loading="eager"
            data-parallax="trigger"
            data-parallax-start="-6"
            data-parallax-end="6"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10"></div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="relative mx-auto w-full max-w-[120rem]" data-animate="stagger-up">
          <p className="eyebrow" data-animate="stagger-up-item">Nuestros servicios</p>
          <h1 className="mt-5 max-w-[12ch] text-[clamp(3rem,6.4vw,6.8rem)] leading-[0.91]" data-animate="stagger-up-item">Soluciones para operar con seguridad.</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90" data-animate="stagger-up-item">Alquiler de vehículos, transporte terrestre y supervisión especializada para minería, construcción e industria.</p>
        </div>
      </section>

      <section className="px-[var(--spacing-gutter)] py-20 md:py-28">
        <div className="mx-auto grid max-w-[120rem] gap-12 lg:grid-cols-[minmax(13rem,0.44fr)_1fr]">
          <div data-animate="stagger-up"><p className="eyebrow" data-animate="stagger-up-item">Qué ofrecemos</p><p className="mt-8 max-w-xs text-lg leading-relaxed" data-animate="stagger-up-item">Servicios que se ajustan a las condiciones y exigencias de cada operación.</p></div>
          <div className="space-y-20 md:space-y-28">
            {services.map(({ number, title, items, Icon, color, media }) => (
              <article className="grid gap-7 lg:grid-cols-[minmax(20rem,1.1fr)_0.9fr] lg:items-end" data-animate="stagger-up" key={title}>
                <div data-animate="stagger-up-item">
                  <div className={`${color} relative aspect-[16/10] overflow-hidden rounded-sm text-white`}>
                    {media.type === "image" ? (
                      <img src={media.src} alt={title} className="absolute inset-0 h-full w-full object-cover" loading="lazy" data-animate="scale-in" />
                    ) : (
                      <video src={media.src} className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline data-animate="scale-in" />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
                    <span className="absolute bottom-5 left-6 flex items-center gap-3 text-sm"><Icon className="h-5 w-5" strokeWidth={1.4} />{number}</span>
                  </div>
                  <h2 className="mt-5 text-[length:var(--text-fluid-h2)]">{title}</h2>
                </div>
                <ul className="space-y-4 pb-2">{items.map((item) => <li className="flex gap-3 text-base leading-relaxed" data-animate="stagger-up-item" key={item}><Check className="mt-1 h-4 w-4 shrink-0 text-brand" strokeWidth={2} />{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark px-[var(--spacing-gutter)] py-20 text-white md:py-28">
        <div className="mx-auto grid max-w-[120rem] gap-12 lg:grid-cols-[minmax(13rem,0.44fr)_1fr]">
          <div data-animate="stagger-up"><p className="eyebrow" data-animate="stagger-up-item">Nuestra propuesta de valor</p><h2 className="mt-7 text-[length:var(--text-fluid-h2)]" data-animate="stagger-up-item">Respaldo para operar con confianza.</h2></div>
          <div data-animate="stagger-up"><p className="max-w-2xl text-base leading-relaxed text-white/80" data-animate="stagger-up-item">En S&amp;E MAPE E.I.R.L. ofrecemos un servicio basado en la seguridad, confiabilidad y continuidad operativa, respaldado por:</p><div className="mt-10 border-t border-white/25">{valuePoints.map((point, index) => <div className="grid gap-4 border-b border-white/25 py-5 md:grid-cols-[2.5rem_1fr]" data-animate="stagger-up-item" key={point}><span className="text-sm text-[#e6ad55]">{String(index + 1).padStart(2, "0")}</span><p className="text-base leading-relaxed text-white/85">{point}</p></div>)}</div></div>
        </div>
      </section>

      <section className="px-[var(--spacing-gutter)] py-20 md:py-28">
        <div className="mx-auto grid max-w-[120rem] gap-12 lg:grid-cols-[minmax(13rem,0.44fr)_1fr]">
          <p className="eyebrow">Compromiso</p>
          <div className="max-w-4xl" data-animate="stagger-up"><h2 className="text-[length:var(--text-fluid-h2)]" data-animate="stagger-up-item">Un aliado estratégico para cada operación.</h2><p className="mt-7 text-base leading-relaxed" data-animate="stagger-up-item">En S&amp;E MAPE E.I.R.L. trabajamos para ser un aliado estratégico confiable, garantizando operaciones seguras, eficientes y alineadas con las exigencias de cada cliente. Nuestro compromiso es brindar soluciones oportunas y especializadas que aporten valor, minimicen riesgos y fortalezcan la continuidad operativa de las organizaciones a las que servimos.</p><Link className="button_main mt-9" href="/contacto">Solicitar una cotización<span className="button_main_icon"><ArrowRight /></span></Link></div>
        </div>
      </section>

      <section className="bg-brand px-[var(--spacing-gutter)] py-20 text-white md:py-24">
        <div className="mx-auto grid max-w-[120rem] gap-12 lg:grid-cols-[minmax(13rem,0.44fr)_1fr]">
          <div data-animate="stagger-up"><p className="eyebrow" data-animate="stagger-up-item">Pólizas</p><h2 className="mt-7 text-[length:var(--text-fluid-h2)]" data-animate="stagger-up-item">Pólizas para un servicio seguro.</h2></div>
          <div className="grid gap-3 sm:grid-cols-2" data-animate="stagger-up">{policies.map((policy) => <div className="flex items-center gap-4 border border-white/40 p-5 text-lg" data-animate="stagger-up-item" key={policy}><FileCheck2 className="h-6 w-6 shrink-0" strokeWidth={1.5} />{policy}</div>)}</div>
        </div>
      </section>
    </main>
  );
}
