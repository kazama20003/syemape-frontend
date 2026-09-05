"use client";

import { Badge } from "@/components/ui/badge";
import RecursoLista, { type Columna } from "@/components/recurso-lista";

const COLOR_ESTADO: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  BORRADOR: "outline",
  EMITIDO: "default",
  EN_RUTA: "default",
  CERRADO: "secondary",
  ANULADO: "destructive",
};

interface Manifiesto {
  id: number;
  numero: string;
  estado: string;
  fechaServicio: string;
  origen: string;
  destino: string;
  unidad: { placa: string };
  conductor: { nombres: string; apellidos: string };
  cliente: { razonSocial: string } | null;
  clienteTexto: string | null;
}

const columnas: Columna<Manifiesto>[] = [
  { titulo: "Número", render: (m) => <span className="font-medium">{m.numero}</span> },
  { titulo: "Fecha", render: (m) => new Date(m.fechaServicio).toLocaleDateString("es-PE") },
  { titulo: "Trayecto", render: (m) => m.origen + " → " + m.destino },
  { titulo: "Unidad", render: (m) => m.unidad.placa },
  { titulo: "Conductor", render: (m) => m.conductor.nombres + " " + m.conductor.apellidos },
  { titulo: "Cliente", render: (m) => m.cliente?.razonSocial ?? m.clienteTexto ?? "—" },
  {
    titulo: "Estado",
    render: (m) => <Badge variant={COLOR_ESTADO[m.estado] ?? "outline"}>{m.estado.replace("_", " ")}</Badge>,
  },
];

export default function Page() {
  return (
    <RecursoLista<Manifiesto>
      titulo="Manifiestos"
      descripcion="Manifiestos de viaje emitidos."
      endpoint="/manifiestos"
      campoBusqueda="numero"
      columnas={columnas}
    />
  );
}
