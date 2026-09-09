"use client";

import { MapPinIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import RecursoLista, { type Columna } from "@/components/recurso-lista";
import FormDialog from "@/components/form-dialog";

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
      icono={<MapPinIcon />}
      titulo="Ubicaciones"
      descripcion="Bases, orígenes, destinos y puestos de control con GPS."
      endpoint="/ubicaciones"
      columnas={columnas}
      acciones={
        <FormDialog
          recurso="Ubicación"
          descripcion="Punto geográfico con coordenadas para rutas y manifiestos."
          endpoint="/ubicaciones"
          campos={[
            { name: "nombre", label: "Nombre", requerido: true, placeholder: "Base Arequipa", ancho: "full" },
            {
              name: "tipo",
              label: "Tipo",
              tipo: "select",
              opciones: [
                { valor: "BASE", etiqueta: "Base" },
                { valor: "ORIGEN", etiqueta: "Origen" },
                { valor: "DESTINO", etiqueta: "Destino" },
                { valor: "PUESTO_CONTROL", etiqueta: "Puesto de control" },
                { valor: "SUCURSAL", etiqueta: "Sucursal" },
                { valor: "GENERAL", etiqueta: "General" },
              ],
            },
            { name: "direccion", label: "Dirección", placeholder: "Av. Ejército 123" },
            { name: "latitud", label: "Latitud", tipo: "number", placeholder: "-16.409047", ayuda: "Entre -90 y 90" },
            { name: "longitud", label: "Longitud", tipo: "number", placeholder: "-71.537451", ayuda: "Entre -180 y 180" },
            { name: "distrito", label: "Distrito" },
            { name: "provincia", label: "Provincia" },
            { name: "departamento", label: "Departamento", placeholder: "Arequipa" },
            { name: "referencia", label: "Referencia", ancho: "full", placeholder: "Frente al grifo…" },
          ]}
        />
      }
    />
  );
}
