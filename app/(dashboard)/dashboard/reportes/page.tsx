"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangleIcon,
  FileTextIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";

interface Conteo {
  paginacion: { total: number };
}

function useTotal(endpoint: string) {
  return useQuery({
    queryKey: ["total", endpoint],
    queryFn: () => api<Conteo>(`${endpoint}?page=1&pageSize=1`),
    refetchInterval: 30_000,
  });
}

function Tarjeta({
  titulo,
  icono,
  total,
  cargando,
}: {
  titulo: string;
  icono: React.ReactNode;
  total?: number;
  cargando: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          {icono} {titulo}
        </CardDescription>
        <CardTitle className="text-3xl font-semibold tabular-nums">
          {cargando ? <Skeleton className="h-8 w-16" /> : (total ?? 0)}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export default function ReportesPage() {
  const manifiestos = useTotal("/manifiestos");
  const unidades = useTotal("/unidades");
  const personal = useTotal("/personal");
  const incidencias = useTotal("/incidencias");

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reportes</h1>
        <p className="text-muted-foreground text-sm">
          Resumen general de la operación. Los reportes detallados con
          exportación a PDF/Excel se agregan en la siguiente fase.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Tarjeta
          titulo="Manifiestos"
          icono={<FileTextIcon className="size-4" />}
          total={manifiestos.data?.paginacion.total}
          cargando={manifiestos.isLoading}
        />
        <Tarjeta
          titulo="Unidades activas"
          icono={<TruckIcon className="size-4" />}
          total={unidades.data?.paginacion.total}
          cargando={unidades.isLoading}
        />
        <Tarjeta
          titulo="Personal activo"
          icono={<UsersIcon className="size-4" />}
          total={personal.data?.paginacion.total}
          cargando={personal.isLoading}
        />
        <Tarjeta
          titulo="Incidencias"
          icono={<AlertTriangleIcon className="size-4" />}
          total={incidencias.data?.paginacion.total}
          cargando={incidencias.isLoading}
        />
      </div>
    </div>
  );
}
