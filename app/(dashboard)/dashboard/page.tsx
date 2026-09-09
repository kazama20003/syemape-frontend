"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  FileTextIcon,
  PlusIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "cn";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/lib/api";

const COLOR_ESTADO: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  BORRADOR: "outline",
  EMITIDO: "default",
  EN_RUTA: "default",
  CERRADO: "secondary",
  ANULADO: "destructive",
};

interface Paginado<T> {
  datos: T[];
  paginacion: { total: number };
}

interface ManifiestoResumen {
  id: number;
  numero: string;
  estado: string;
  fechaServicio: string;
  origen: string;
  destino: string;
  unidad: { placa: string };
  conductor: { nombres: string; apellidos: string };
}

function useConteo(endpoint: string, extra = "") {
  return useQuery({
    queryKey: ["total", endpoint, extra],
    queryFn: () => api<Paginado<unknown>>(`${endpoint}?page=1&pageSize=1${extra}`),
    refetchInterval: 30_000,
  });
}

function TarjetaKpi({
  titulo,
  detalle,
  icono,
  total,
  cargando,
  href,
}: {
  titulo: string;
  detalle: string;
  icono: React.ReactNode;
  total?: number;
  cargando: boolean;
  href: string;
}) {
  return (
    <Link href={href} className="group">
      <Card className="transition-shadow group-hover:shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardDescription>{titulo}</CardDescription>
              <CardTitle className="mt-1 text-3xl font-semibold tabular-nums">
                {cargando ? <Skeleton className="h-9 w-16" /> : (total ?? 0)}
              </CardTitle>
            </div>
            <div className="bg-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-lg [&_svg]:size-5">
              {icono}
            </div>
          </div>
          <p className="text-muted-foreground text-xs">{detalle}</p>
        </CardHeader>
      </Card>
    </Link>
  );
}

// Panel de inicio: indicadores reales de la operación y últimos manifiestos.
export default function DashboardPage() {
  const unidades = useConteo("/unidades", "&estadoUnidad=OPERATIVA");
  const personal = useConteo("/personal");
  const manifiestos = useConteo("/manifiestos");
  const incidencias = useConteo("/incidencias");

  const ultimos = useQuery({
    queryKey: ["/manifiestos", "ultimos"],
    queryFn: () => api<Paginado<ManifiestoResumen>>("/manifiestos?page=1&pageSize=8"),
    refetchInterval: 15_000,
  });

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Panel de operación</h1>
          <p className="text-muted-foreground text-sm">
            Resumen en vivo de la flota, el personal y los servicios de S&amp;E MAPE.
          </p>
        </div>
        <Link href="/dashboard/manifiestos/nueva" className={cn(buttonVariants())}>
          <PlusIcon /> Nuevo manifiesto
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaKpi
          titulo="Unidades operativas"
          detalle="Flota disponible para asignar a servicios."
          icono={<TruckIcon />}
          total={unidades.data?.paginacion.total}
          cargando={unidades.isLoading}
          href="/dashboard/unidades"
        />
        <TarjetaKpi
          titulo="Personal"
          detalle="Conductores, supervisores y escoltas activos."
          icono={<UsersIcon />}
          total={personal.data?.paginacion.total}
          cargando={personal.isLoading}
          href="/dashboard/personal"
        />
        <TarjetaKpi
          titulo="Manifiestos"
          detalle="Servicios registrados en el sistema."
          icono={<FileTextIcon />}
          total={manifiestos.data?.paginacion.total}
          cargando={manifiestos.isLoading}
          href="/dashboard/manifiestos"
        />
        <TarjetaKpi
          titulo="Incidencias"
          detalle="Eventos reportados en ruta."
          icono={<AlertTriangleIcon />}
          total={incidencias.data?.paginacion.total}
          cargando={incidencias.isLoading}
          href="/dashboard/incidencias"
        />
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <CardTitle>Últimos manifiestos</CardTitle>
              <CardDescription>Los servicios más recientes y su estado.</CardDescription>
            </div>
            <Link
              href="/dashboard/manifiestos"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Ver todos <ArrowRightIcon />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6">Número</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Trayecto</TableHead>
                <TableHead>Unidad</TableHead>
                <TableHead>Conductor</TableHead>
                <TableHead className="pr-6">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ultimos.isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j} className={j === 0 ? "pl-6" : undefined}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (ultimos.data?.datos.length ?? 0) === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="p-0">
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <FileTextIcon />
                        </EmptyMedia>
                        <EmptyTitle>Sin manifiestos todavía</EmptyTitle>
                        <EmptyDescription>
                          Registra el primero con el botón &quot;Nuevo manifiesto&quot;.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              ) : (
                ultimos.data?.datos.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="pl-6 font-medium">{m.numero}</TableCell>
                    <TableCell>
                      {new Date(m.fechaServicio).toLocaleDateString("es-PE")}
                    </TableCell>
                    <TableCell>
                      {m.origen} → {m.destino}
                    </TableCell>
                    <TableCell>{m.unidad.placa}</TableCell>
                    <TableCell>
                      {m.conductor.nombres} {m.conductor.apellidos}
                    </TableCell>
                    <TableCell className="pr-6">
                      <Badge variant={COLOR_ESTADO[m.estado] ?? "outline"}>
                        {m.estado.replace("_", " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
