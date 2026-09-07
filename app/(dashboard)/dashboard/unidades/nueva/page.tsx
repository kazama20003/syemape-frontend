import UnidadForm from "@/components/unidad-form";

export default function NuevaUnidadPage() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nueva unidad</h1>
        <p className="text-muted-foreground text-sm">
          Registra la información operativa, técnica y de mantenimiento de la unidad.
        </p>
      </div>
      <UnidadForm />
    </div>
  );
}
