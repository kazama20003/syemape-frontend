export default function DashboardPage() {
  return (
    <div className="u-container mx-auto max-w-5xl py-16">
      <p className="eyebrow text-brand">Dashboard</p>
      <h1 className="mt-4 text-[length:var(--text-fluid-h2)]">Panel de control</h1>
      <p className="mt-3 max-w-md text-sm opacity-70">
        Contenido del dashboard en construcción.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {["Resumen", "Actividad", "Reportes"].map((t) => (
          <div key={t} className="card-line rounded-[var(--radius-main)] p-6">
            <h2 className="text-[length:var(--text-fluid-h5)]">{t}</h2>
            <p className="mt-2 text-xs opacity-60">Próximamente</p>
          </div>
        ))}
      </div>
    </div>
  );
}
