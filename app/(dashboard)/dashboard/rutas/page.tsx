"use client";

import { Badge } from "@/components/ui/badge";
import RecursoLista, { type Columna } from "@/components/recurso-lista";

interface Ruta {
  id: number;
  nombre: string;
  origen: string;
  destino: string;
  distanciaKm: number | null;
  duracionEstimadaHoras: number | null;
}

const columnas: Columna<Ruta>[] = [
  { titulo: "Nombre", render: (r) => <span className="font-medium">{r.nombre}</span> },
  { titulo: "Trayecto", render: (r) => r.origen + " → " + r.destino },
  { titulo: "Distancia", render: (r) => (r.distanciaKm ? r.distanciaKm + " km" : "—") },
  { titulo: "Duración est.", render: (r) => (r.duracionEstimadaHoras ? r.duracionEstimadaHoras + " h" : "—") },
];

export default function Page() {
  return (
    <RecursoLista<Ruta>
      titulo="Rutas"
      descripcion="Trayectos origen → destino reutilizables."
      endpoint="/rutas"
      columnas={columnas}
    />
  );
}
