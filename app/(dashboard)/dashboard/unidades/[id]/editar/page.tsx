"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";
import UnidadForm from "@/components/unidad-form";
import { Button } from "@/components/ui/button";

export default function EditarUnidadPage() {
  const params = useParams<{ id: string }>();
  const unidadId = Number(params.id);

  if (!Number.isSafeInteger(unidadId) || unidadId <= 0) {
    return (
      <div className="flex flex-col gap-4 p-4 lg:p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Unidad no válida</h1>
        <p className="text-muted-foreground text-sm">El identificador de la unidad no es válido.</p>
        <Button render={<Link href="/dashboard/unidades" />} variant="outline" className="w-fit">
          <ArrowLeftIcon /> Volver a unidades
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary mt-1 grid size-10 shrink-0 place-items-center rounded-lg">
            <PencilIcon className="size-5" />
          </div>
          <div>
            <p className="text-primary text-xs font-semibold uppercase tracking-wider">Administración de flota</p>
            <h1 className="text-2xl font-semibold tracking-tight">Editar unidad</h1>
            <p className="text-muted-foreground text-sm">Actualiza la identificación, ficha técnica, asignación y mantenimiento.</p>
          </div>
        </div>
        <Button render={<Link href="/dashboard/unidades" />} variant="outline">
          <ArrowLeftIcon /> Volver a unidades
        </Button>
      </div>
      <UnidadForm unidadId={unidadId} />
    </div>
  );
}
