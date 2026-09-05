"use client";

import { Badge } from "@/components/ui/badge";
import RecursoLista, { type Columna } from "@/components/recurso-lista";

interface Personal {
  id: number;
  nombres: string;
  apellidos: string;
  numeroDocumento: string;
  tipo: string;
  apelativo: string | null;
  telefono: string | null;
  licenciaConducir: string | null;
  categoriaLicencia: string | null;
  estadoActivo: string;
}

const columnas: Columna<Personal>[] = [
  {
    titulo: "Nombre",
    render: (p) => (
      <span className="font-medium">
        {p.nombres} {p.apellidos}
        {p.apelativo && <span className="text-muted-foreground ml-1 text-xs">({p.apelativo})</span>}
      </span>
    ),
  },
  { titulo: "Documento", render: (p) => p.numeroDocumento },
  { titulo: "Tipo", render: (p) => <Badge variant="outline">{p.tipo}</Badge> },
  {
    titulo: "Licencia",
    render: (p) =>
      p.licenciaConducir ? p.licenciaConducir + (p.categoriaLicencia ? " · " + p.categoriaLicencia : "") : "—",
  },
  { titulo: "Teléfono", render: (p) => p.telefono ?? "—" },
  {
    titulo: "Estado",
    render: (p) => (
      <Badge variant={p.estadoActivo === "ACTIVO" ? "default" : "secondary"}>{p.estadoActivo}</Badge>
    ),
  },
];

export default function Page() {
  return (
    <RecursoLista<Personal>
      titulo="Personal"
      descripcion="Conductores, supervisores y tripulación."
      endpoint="/personal"
      columnas={columnas}
    />
  );
}
