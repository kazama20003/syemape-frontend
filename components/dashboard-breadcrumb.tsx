"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Etiquetas legibles por segmento de URL del dashboard.
const ETIQUETAS: Record<string, string> = {
  dashboard: "Inicio",
  activos: "Activos",
  unidades: "Unidades",
  personal: "Personal",
  clientes: "Clientes",
  rutas: "Rutas",
  ubicaciones: "Ubicaciones",
  "tipos-servicio": "Tipos de servicio",
  "tipos-vehiculo": "Tipos de vehículo",
  manifiestos: "Manifiestos",
  incidencias: "Incidencias",
  historial: "Historial",
  usuarios: "Usuarios",
  reportes: "Reportes",
  perfil: "Perfil",
  seguimiento: "Seguimiento",
  documentos: "Documentos",
  nueva: "Nueva",
  nuevo: "Nuevo",
};

function etiquetaDe(segmento: string): string {
  if (ETIQUETAS[segmento]) return ETIQUETAS[segmento];
  // Ids numéricos o uuids: detalle del registro.
  if (/^\d+$/.test(segmento)) return `#${segmento}`;
  return segmento.charAt(0).toUpperCase() + segmento.slice(1).replace(/-/g, " ");
}

// Migas de pan del dashboard generadas desde la ruta actual.
export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const segmentos = pathname.split("/").filter(Boolean);
  if (segmentos[0] !== "dashboard") return null;

  // Acumula las rutas intermedias: /dashboard, /dashboard/unidades, …
  const migas = segmentos.map((seg, i) => ({
    href: "/" + segmentos.slice(0, i + 1).join("/"),
    etiqueta: etiquetaDe(seg),
    esInicio: i === 0,
    esUltima: i === segmentos.length - 1,
  }));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {migas.map((miga) => (
          <Fragment key={miga.href}>
            {!miga.esInicio && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {miga.esUltima ? (
                <BreadcrumbPage className="flex items-center gap-1.5">
                  {miga.esInicio && <HomeIcon className="size-3.5" />}
                  {miga.etiqueta}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  className="flex items-center gap-1.5"
                  render={<Link href={miga.href} />}
                >
                  {miga.esInicio && <HomeIcon className="size-3.5" />}
                  {miga.etiqueta}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
