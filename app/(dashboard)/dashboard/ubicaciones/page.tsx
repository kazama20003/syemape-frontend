"use client";

import { Badge } from "@/components/ui/badge";
import RecursoLista, { type Columna } from "@/components/recurso-lista";

interface Ubicacion {
  id: number;
  nombre: string;
  tipo: string;
  latitud: number | null;
  longitud: number | null;
  distrito: string | null;
  departamento: string | null;
}

const columnas: Columna<Ubicacion>[] = [
  { titulo: "Nombre", render: (u) => <span className="font-medium">{u.nombre}</span> },
  { titulo: "Tipo", render: (u) => <Badge variant="outline">{u.tipo.replace("_", " ")}</Badge> },
  {
    titulo: "Coordenadas",
    render: (u) =>
      u.latitud != null && u.longitud != null ? (
        <a
          className="text-primary underline-offset-2 hover:underline"
          href={"https://maps.google.com/?q=" + u.latitud + "," + u.longitud}
          target="_blank"
          rel="noreferrer"
        >
          {u.latitud}, {u.longitud}
        </a>
      ) : (
        "—"
      ),
  },
  { titulo: "Zona", render: (u) => [u.distrito, u.departamento].filter(Boolean).join(", ") || "—" },
];

export default function Page() {
  return (
    <RecursoLista<Ubicacion>
      titulo="Ubicaciones"
      descripcion="Bases, orígenes, destinos y puestos de control con GPS."
      endpoint="/ubicaciones"
      columnas={columnas}
    />
  );
}
