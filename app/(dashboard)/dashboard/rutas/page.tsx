"use client";

import { RouteIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import RecursoLista, { type Columna } from "@/components/recurso-lista";
import FormDialog from "@/components/form-dialog";

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
      icono={<RouteIcon />}
      titulo="Rutas"
      descripcion="Trayectos origen → destino reutilizables."
      endpoint="/rutas"
      columnas={columnas}
      acciones={
        <FormDialog
          recurso="Ruta"
          descripcion="Trayecto reutilizable para los manifiestos."
          endpoint="/rutas"
          campos={[
            { name: "nombre", label: "Nombre", requerido: true, placeholder: "Arequipa - Quellaveco", ancho: "full" },
            { name: "ubicacionOrigenId", label: "Origen (ubicación)", requerido: true, opcionesEndpoint: "/ubicaciones" },
            { name: "ubicacionDestinoId", label: "Destino (ubicación)", requerido: true, opcionesEndpoint: "/ubicaciones" },
            { name: "distanciaKm", label: "Distancia (km)", tipo: "number", placeholder: "245" },
            { name: "duracionEstimadaHoras", label: "Duración estimada (h)", tipo: "number", placeholder: "5.5" },
            { name: "descripcion", label: "Descripción", ancho: "full", placeholder: "Vía Imata - Crucero Alto…" },
          ]}
        />
      }
    />
  );
}
