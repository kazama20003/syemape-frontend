"use client";

import { Badge } from "@/components/ui/badge";
import RecursoLista, { type Columna } from "@/components/recurso-lista";

interface TipoServicio {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  estadoActivo: string;
}

const columnas: Columna<TipoServicio>[] = [
  { titulo: "Código", render: (t) => <code className="text-xs">{t.codigo}</code> },
  { titulo: "Nombre", render: (t) => <span className="font-medium">{t.nombre}</span> },
  { titulo: "Descripción", render: (t) => t.descripcion ?? "—" },
  {
    titulo: "Estado",
    render: (t) => (
      <Badge variant={t.estadoActivo === "ACTIVO" ? "default" : "secondary"}>{t.estadoActivo}</Badge>
    ),
  },
];

export default function Page() {
  return (
    <RecursoLista<TipoServicio>
      titulo="Tipos de servicio"
      descripcion="Catálogo de servicios que presta la empresa."
      endpoint="/tipos-servicio"
      columnas={columnas}
    />
  );
}
