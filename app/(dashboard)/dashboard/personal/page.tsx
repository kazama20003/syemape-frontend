"use client";

import { Badge } from "@/components/ui/badge";
import RecursoLista, { type Columna } from "@/components/recurso-lista";
import FormDialog from "@/components/form-dialog";

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
      acciones={
        <FormDialog
          recurso="Personal"
          descripcion="Ficha de conductor, supervisor o tripulación."
          endpoint="/personal"
          textoBoton="Nuevo personal"
          campos={[
            { name: "nombres", label: "Nombres", requerido: true },
            { name: "apellidos", label: "Apellidos", requerido: true },
            {
              name: "tipoDocumento",
              label: "Tipo de documento",
              tipo: "select",
              opciones: [
                { valor: "DNI", etiqueta: "DNI" },
                { valor: "CE", etiqueta: "Carnet de extranjería" },
                { valor: "PASAPORTE", etiqueta: "Pasaporte" },
              ],
            },
            { name: "numeroDocumento", label: "N° de documento", requerido: true, placeholder: "40420485" },
            {
              name: "tipo",
              label: "Rol operativo",
              tipo: "select",
              opciones: [
                { valor: "CONDUCTOR", etiqueta: "Conductor" },
                { valor: "COPILOTO", etiqueta: "Copiloto" },
                { valor: "SUPERVISOR", etiqueta: "Supervisor" },
                { valor: "ESCOLTA", etiqueta: "Escolta" },
              ],
            },
            { name: "apelativo", label: "Apelativo (radio)", placeholder: "COMANDO 1" },
            { name: "telefono", label: "Celular", tipo: "tel", placeholder: "917 874 745" },
            { name: "licenciaConducir", label: "Licencia", placeholder: "H40420485" },
            {
              name: "categoriaLicencia",
              label: "Categoría de licencia",
              tipo: "select",
              opciones: [
                { valor: "A I", etiqueta: "A I" },
                { valor: "A IIA", etiqueta: "A IIA" },
                { valor: "A IIB", etiqueta: "A IIB" },
                { valor: "A IIIA", etiqueta: "A IIIA" },
                { valor: "A IIIB", etiqueta: "A IIIB" },
                { valor: "A IIIC", etiqueta: "A IIIC" },
              ],
            },
            { name: "licenciaVencimiento", label: "Vigencia de licencia", tipo: "date" },
          ]}
        />
      }
    />
  );
}
