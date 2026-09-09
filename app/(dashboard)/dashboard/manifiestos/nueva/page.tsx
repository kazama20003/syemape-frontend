import OrdenServicioForm from "@/components/orden-servicio-form";

export default function NuevaOrdenServicioPage() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nuevo manifiesto</h1>
        <p className="text-muted-foreground text-sm">
          Programa un viaje: trayecto, unidad, conductor, supervisión y carga.
        </p>
      </div>
      <OrdenServicioForm />
    </div>
  );
}
