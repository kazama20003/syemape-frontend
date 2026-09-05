"use client";

import { Badge } from "@/components/ui/badge";
import RecursoLista, { type Columna } from "@/components/recurso-lista";

interface Cliente {
  id: number;
  razonSocial: string;
  tipoDocumento: string;
  numeroDocumento: string | null;
  cuenta: string | null;
  contactoNombre: string | null;
  contactoTelefono: string | null;
  estadoActivo: string;
}

const columnas: Columna<Cliente>[] = [
  { titulo: "Razón social", render: (c) => <span className="font-medium">{c.razonSocial}</span> },
  { titulo: "Documento", render: (c) => (c.numeroDocumento ? c.tipoDocumento + " " + c.numeroDocumento : "—") },
  { titulo: "Cuenta", render: (c) => c.cuenta ?? "—" },
  {
    titulo: "Contacto",
    render: (c) => [c.contactoNombre, c.contactoTelefono].filter(Boolean).join(" · ") || "—",
  },
  {
    titulo: "Estado",
    render: (c) => (
      <Badge variant={c.estadoActivo === "ACTIVO" ? "default" : "secondary"}>{c.estadoActivo}</Badge>
    ),
  },
];

export default function Page() {
  return (
    <RecursoLista<Cliente>
      titulo="Clientes"
      descripcion="Empresas a las que se les presta servicio."
      endpoint="/clientes"
      columnas={columnas}
    />
  );
}
