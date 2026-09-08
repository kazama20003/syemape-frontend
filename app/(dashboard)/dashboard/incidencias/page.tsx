"use client";

import { AlertTriangleIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import RecursoLista, { type Columna } from "@/components/recurso-lista";

const COLOR_CRITICIDAD: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  BAJA: "outline",
  MEDIA: "secondary",
  ALTA: "default",
  CRITICA: "destructive",
};

interface Incidencia {
  id: number;
  manifiestoId: number;
  tipo: string;
  criticidad: string;
  estado: string;
  descripcion: string;
  reportadoPor: string;
  fechaReporte: string;
}

const columnas: Columna<Incidencia>[] = [
  { titulo: "Fecha", render: (i) => new Date(i.fechaReporte).toLocaleString("es-PE") },
  { titulo: "Tipo", render: (i) => i.tipo.replace(/_/g, " ") },
  {
    titulo: "Criticidad",
    render: (i) => <Badge variant={COLOR_CRITICIDAD[i.criticidad] ?? "outline"}>{i.criticidad}</Badge>,
  },
  {
    titulo: "Estado",
    render: (i) => (
      <Badge variant={i.estado === "RESUELTA" ? "secondary" : "default"}>{i.estado.replace("_", " ")}</Badge>
    ),
  },
  { titulo: "Descripción", render: (i) => <span className="line-clamp-2 max-w-md">{i.descripcion}</span> },
  { titulo: "Reportó", render: (i) => i.reportadoPor },
];

export default function Page() {
  return (
    <RecursoLista<Incidencia>
      icono={<AlertTriangleIcon />}
      titulo="Incidencias"
      descripcion="Accidentes, fallas y eventos reportados en ruta."
      endpoint="/incidencias"
      campoBusqueda={null}
      columnas={columnas}
    />
  );
}
