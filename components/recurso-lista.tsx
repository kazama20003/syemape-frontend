"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { AlertCircleIcon, InboxIcon, SearchIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiError, api } from "@/lib/api";

export interface Columna<T> {
  titulo: string;
  render: (fila: T) => React.ReactNode;
}

interface Paginacion {
  pagina: number;
  totalPaginas: number;
  total: number;
  tieneSiguiente: boolean;
  tieneAnterior: boolean;
}

// Listado generico de un recurso del API: busqueda + paginacion + refetch
// periodico (cambios de otros usuarios aparecen solos).
export default function RecursoLista<T extends { id: number }>({
  titulo,
  descripcion,
  endpoint,
  campoBusqueda = "texto",
  columnas,
  acciones,
  icono,
}: {
  titulo: string;
  descripcion: string;
  endpoint: string;
  // Nombre del query param de busqueda del backend (texto | placa | numero...).
  campoBusqueda?: string | null;
  columnas: Columna<T>[];
  acciones?: React.ReactNode;
  // Icono del recurso mostrado junto al titulo.
  icono?: React.ReactNode;
}) {
  const [busqueda, setBusqueda] = useState("");
  const [page, setPage] = useState(1);

  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: [endpoint, { busqueda, page }],
    queryFn: () => {
      const q = new URLSearchParams();
      if (busqueda && campoBusqueda) q.set(campoBusqueda, busqueda);
      q.set("page", String(page));
      q.set("pageSize", "20");
      return api<{ datos: T[]; paginacion: Paginacion }>(
        `${endpoint}?${q.toString()}`,
      );
    },
    placeholderData: keepPreviousData,
    refetchInterval: 15_000,
  });

  const filas = data?.datos ?? [];
  const paginacion = data?.paginacion;

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {icono && (
            <div className="bg-primary/10 text-primary grid size-10 shrink-0 place-items-center rounded-lg [&_svg]:size-5">
              {icono}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">{titulo}</h1>
              {paginacion && (
                <Badge variant="secondary" className="tabular-nums">
                  {paginacion.total}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              {descripcion}
              {isFetching && !isLoading && (
                <span className="ml-2 text-xs" aria-live="polite">Actualizando…</span>
              )}
            </p>
          </div>
        </div>
        <div className="max-sm:w-full max-sm:[&>button]:w-full">{acciones}</div>
      </div>

      {campoBusqueda && (
        <div className="relative w-full sm:max-w-xs">
          <SearchIcon className="text-muted-foreground absolute left-2.5 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder="Buscar…"
            className="pl-8"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPage(1);
            }}
          />
        </div>
      )}

      {error ? (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>No se pudieron cargar los registros</AlertTitle>
          <AlertDescription>
            {error instanceof ApiError ? error.message : "Ocurrió un error inesperado."}
            <Button className="mt-2 w-fit" variant="outline" size="sm" onClick={() => refetch()}>
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
      <div className="overflow-hidden rounded-lg border shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              {columnas.map((c) => (
                <TableHead key={c.titulo}>{c.titulo}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columnas.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columnas.length} className="p-0">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <InboxIcon />
                      </EmptyMedia>
                      <EmptyTitle>
                        {busqueda ? "Sin resultados para la búsqueda" : "Sin registros todavía"}
                      </EmptyTitle>
                      <EmptyDescription>
                        {busqueda
                          ? "Prueba con otro término."
                          : "Usa el botón de arriba para registrar el primero."}
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            ) : (
              filas.map((fila) => (
                <TableRow key={fila.id}>
                  {columnas.map((c) => (
                    <TableCell key={c.titulo}>{c.render(fila)}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      )}

      {paginacion && paginacion.totalPaginas > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-muted-foreground text-sm">
            Página {paginacion.pagina} de {paginacion.totalPaginas} ·{" "}
            {paginacion.total} registros
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!paginacion.tieneAnterior}
              onClick={() => setPage((p) => p - 1)}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!paginacion.tieneSiguiente}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
