"use client";

import { Badge } from "@/components/ui/badge";
import RecursoLista, { type Columna } from "@/components/recurso-lista";

interface Evento {
  id: number;
  entidad: string;
  entidadId: number;
  accion: string;
  usuario: string;
  fecha: string;
}

const COLOR_ACCION: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  CREAR: "default",
  ACTUALIZAR: "secondary",
  CAMBIAR_ESTADO: "secondary",
  ANULAR: "destructive",
  REACTIVAR: "outline",
};

const columnas: Columna<Evento>[] = [
  { titulo: "Fecha", render: (e) => new Date(e.fecha).toLocaleString("es-PE") },
  {
    titulo: "Acción",
    render: (e) => <Badge variant={COLOR_ACCION[e.accion] ?? "outline"}>{e.accion.replace("_", " ")}</Badge>,
  },
  { titulo: "Entidad", render: (e) => e.entidad + " #" + e.entidadId },
  { titulo: "Usuario", render: (e) => e.usuario },
];

export default function Page() {
  return (
    <RecursoLista<Evento>
      titulo="Historial"
      descripcion="Auditoría: todo lo creado, modificado o anulado, y por quién."
      endpoint="/historial"
      campoBusqueda="usuario"
      columnas={columnas}
    />
  );
}
