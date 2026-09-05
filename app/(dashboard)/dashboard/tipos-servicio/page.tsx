"use client";

import { Badge } from "@/components/ui/badge";
import RecursoLista, { type Columna } from "@/components/recurso-lista";
import FormDialog from "@/components/form-dialog";

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
      acciones={
        <FormDialog
          recurso="Tipo de servicio"
          descripcion="Categoría de servicio que presta la empresa."
          endpoint="/tipos-servicio"
          textoBoton="Nuevo tipo"
          campos={[
            { name: "nombre", label: "Nombre", requerido: true, placeholder: "Supervisión en ruta", ancho: "full" },
            { name: "codigo", label: "Código (opcional)", placeholder: "Se genera del nombre", ancho: "full" },
            { name: "descripcion", label: "Descripción", ancho: "full" },
          ]}
        />
      }
    />
  );
}
