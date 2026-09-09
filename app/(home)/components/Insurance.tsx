const sectors = [
  "Minería",
  "Construcción",
  "Industria",
  "Energía",
  "Logística",
  "Carga sobredimensionada",
  "MATPEL",
  "Proyectos en campo",
];

export default function Insurance() {
  return (
    <>
<section className="insurance_wrap u-section u-theme-light pb-8 pt-10">
<div className="flex justify-center">
<p className="eyebrow">Movemos operaciones en todo el Perú</p>
</div>
<div className="marquee-4_component mt-8">
<div className="marquee-4_layout">
<div className="marquee-4_panel">
{sectors.map((s) => (
<span key={s} className="whitespace-nowrap text-[1.625rem] font-bold tracking-tight text-dark/80">{s}</span>
))}
</div>
<div className="marquee-4_panel">
{sectors.map((s) => (
<span key={s} className="whitespace-nowrap text-[1.625rem] font-bold tracking-tight text-dark/80">{s}</span>
))}
</div>
</div>
</div>
</section>
    </>
  );
}
