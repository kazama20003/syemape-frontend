"use client";

import { Building2Icon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import RecursoLista, { type Columna } from "@/components/recurso-lista";
import FormDialog from "@/components/form-dialog";

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
      icono={<Building2Icon />}
      titulo="Clientes"
      descripcion="Empresas a las que se les presta servicio."
      endpoint="/clientes"
      columnas={columnas}
      acciones={
        <FormDialog
          recurso="Cliente"
          descripcion="Empresa a la que se le presta servicio."
          endpoint="/clientes"
          campos={[
            { name: "razonSocial", label: "Razón social", requerido: true, placeholder: "HAGEMSA S.A.C.", ancho: "full" },
            {
              name: "tipoDocumento",
              label: "Tipo de documento",
              tipo: "select",
              opciones: [
                { valor: "RUC", etiqueta: "RUC" },
                { valor: "DNI", etiqueta: "DNI" },
              ],
            },
            { name: "numeroDocumento", label: "N° de documento", placeholder: "20100038146" },
            { name: "cuenta", label: "Cuenta / proyecto", placeholder: "CERRO VERDE" },
            { name: "email", label: "Email", tipo: "email" },
            { name: "contactoNombre", label: "Contacto" },
            { name: "contactoTelefono", label: "Teléfono de contacto", tipo: "tel" },
            { name: "direccion", label: "Dirección", ancho: "full" },
          ]}
        />
      }
    />
  );
}
