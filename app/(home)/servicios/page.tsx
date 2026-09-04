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
  },
  {
    number: "02",
    title: "Servicios de transporte terrestre",
    items: ["Transporte de mercancías a nivel nacional.", "Transporte de materiales peligrosos (MATPEL).", "Transporte de carga sobredimensionada."],
    Icon: Truck,
    color: "bg-brand",
  },
  {
    number: "03",
    title: "Supervisión, escolta y resguardo en ruta",
    items: ["Supervisión de rutas.", "Escolta de carga sobredimensionada.", "Resguardo de carga.", "Piloteo de convoyes y mercancías, incluyendo la señalización para MATPEL."],
    Icon: ShieldCheck,
    color: "bg-[#263e42]",
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
      <section className="flex min-h-[34rem] items-end bg-[#41577e] px-[var(--spacing-gutter)] pb-12 pt-28 text-white md:min-h-[42rem] md:pb-16">
        <div className="mx-auto w-full max-w-[120rem]">
          <p className="eyebrow">Nuestros servicios</p>
          <h1 className="mt-5 max-w-[12ch] text-[clamp(3rem,6.4vw,6.8rem)] leading-[0.91]">Soluciones para operar con seguridad.</h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85">Alquiler de vehículos, transporte terrestre y supervisión especializada para minería, construcción e industria.</p>
        </div>
      </section>

      <section className="px-[var(--spacing-gutter)] py-20 md:py-28">
        <div className="mx-auto grid max-w-[120rem] gap-12 lg:grid-cols-[minmax(13rem,0.44fr)_1fr]">
          <div><p className="eyebrow">Qué ofrecemos</p><p className="mt-8 max-w-xs text-lg leading-relaxed">Servicios que se ajustan a las condiciones y exigencias de cada operación.</p></div>
          <div className="space-y-20 md:space-y-28">
            {services.map(({ number, title, items, Icon, color }) => (
              <article className="grid gap-7 lg:grid-cols-[minmax(20rem,1.1fr)_0.9fr] lg:items-end" key={title}>
                <div><div className={`${color} relative grid aspect-[16/10] place-items-center overflow-hidden rounded-sm text-white`}><Icon className="h-[34%] w-[34%]" strokeWidth={1} /><span className="absolute bottom-5 left-6 text-sm">{number}</span></div><h2 className="mt-5 text-[length:var(--text-fluid-h2)]">{title}</h2></div>
                <ul className="space-y-4 pb-2">{items.map((item) => <li className="flex gap-3 text-base leading-relaxed" key={item}><Check className="mt-1 h-4 w-4 shrink-0 text-brand" strokeWidth={2} />{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-dark px-[var(--spacing-gutter)] py-20 text-white md:py-28">
        <div className="mx-auto grid max-w-[120rem] gap-12 lg:grid-cols-[minmax(13rem,0.44fr)_1fr]">
          <div><p className="eyebrow">Nuestra propuesta de valor</p><h2 className="mt-7 text-[length:var(--text-fluid-h2)]">Respaldo para operar con confianza.</h2></div>
          <div><p className="max-w-2xl text-base leading-relaxed text-white/80">En S&amp;E MAPE E.I.R.L. ofrecemos un servicio basado en la seguridad, confiabilidad y continuidad operativa, respaldado por:</p><div className="mt-10 border-t border-white/25">{valuePoints.map((point, index) => <div className="grid gap-4 border-b border-white/25 py-5 md:grid-cols-[2.5rem_1fr]" key={point}><span className="text-sm text-[#e6ad55]">{String(index + 1).padStart(2, "0")}</span><p className="text-base leading-relaxed text-white/85">{point}</p></div>)}</div></div>
        </div>
      </section>

      <section className="px-[var(--spacing-gutter)] py-20 md:py-28">
        <div className="mx-auto grid max-w-[120rem] gap-12 lg:grid-cols-[minmax(13rem,0.44fr)_1fr]">
          <p className="eyebrow">Compromiso</p>
          <div className="max-w-4xl"><h2 className="text-[length:var(--text-fluid-h2)]">Un aliado estratégico para cada operación.</h2><p className="mt-7 text-base leading-relaxed">En S&amp;E MAPE E.I.R.L. trabajamos para ser un aliado estratégico confiable, garantizando operaciones seguras, eficientes y alineadas con las exigencias de cada cliente. Nuestro compromiso es brindar soluciones oportunas y especializadas que aporten valor, minimicen riesgos y fortalezcan la continuidad operativa de las organizaciones a las que servimos.</p><Link className="button_main mt-9" href="/contacto">Solicitar una cotización<span className="button_main_icon"><ArrowRight /></span></Link></div>
        </div>
      </section>

      <section className="bg-brand px-[var(--spacing-gutter)] py-20 text-white md:py-24">
        <div className="mx-auto grid max-w-[120rem] gap-12 lg:grid-cols-[minmax(13rem,0.44fr)_1fr]">
          <div><p className="eyebrow">Pólizas</p><h2 className="mt-7 text-[length:var(--text-fluid-h2)]">Pólizas para un servicio seguro.</h2></div>
          <div className="grid gap-3 sm:grid-cols-2">{policies.map((policy) => <div className="flex items-center gap-4 border border-white/40 p-5 text-lg" key={policy}><FileCheck2 className="h-6 w-6 shrink-0" strokeWidth={1.5} />{policy}</div>)}</div>
        </div>
      </section>
    </main>
  );
}
