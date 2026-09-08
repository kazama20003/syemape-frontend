"use client";

import { TagsIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import RecursoLista, { type Columna } from "@/components/recurso-lista";
import FormDialog from "@/components/form-dialog";

interface TipoVehiculo {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  claseSugerida: string | null;
  categoriaSugerida: string | null;
  estadoActivo: string;
}

const CLASES = [
  { valor: "LIVIANO", etiqueta: "Liviano" },
  { valor: "PESADO", etiqueta: "Pesado" },
  { valor: "REMOLQUE", etiqueta: "Remolque" },
  { valor: "SEMIRREMOLQUE", etiqueta: "Semirremolque" },
  { valor: "OTRO", etiqueta: "Otro" },
];

const CATEGORIAS = ["N1", "N2", "N3", "M1", "M2", "M3", "O1", "O2", "O3", "O4"].map(
  (c) => ({ valor: c, etiqueta: c }),
);

const columnas: Columna<TipoVehiculo>[] = [
  { titulo: "Código", render: (t) => <code className="text-xs">{t.codigo}</code> },
  { titulo: "Nombre", render: (t) => <span className="font-medium">{t.nombre}</span> },
  { titulo: "Clase sugerida", render: (t) => t.claseSugerida ?? "—" },
  { titulo: "Categoría MTC", render: (t) => t.categoriaSugerida ?? "—" },
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
    <RecursoLista<TipoVehiculo>
      icono={<TagsIcon />}
      titulo="Tipos de vehículo"
      descripcion="Catálogo maestro de tipos de vehículo con su clase y categoría MTC sugeridas."
      endpoint="/tipos-vehiculo"
      columnas={columnas}
      acciones={
        <FormDialog
          recurso="Tipo de vehículo"
          descripcion="Tipo de vehículo del maestro; la clase y categoría se autocompletan al registrar unidades."
          endpoint="/tipos-vehiculo"
          textoBoton="Nuevo tipo"
          campos={[
            { name: "nombre", label: "Nombre", requerido: true, placeholder: "Camión grúa", ancho: "full" },
            { name: "codigo", label: "Código (opcional)", placeholder: "Se genera del nombre", ancho: "full" },
            { name: "claseSugerida", label: "Clase sugerida", tipo: "select", opciones: CLASES },
            { name: "categoriaSugerida", label: "Categoría MTC sugerida", tipo: "select", opciones: CATEGORIAS },
            { name: "descripcion", label: "Descripción", ancho: "full" },
          ]}
        />
      }
    />
  );
}
