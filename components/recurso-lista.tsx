"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
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
}: {
  titulo: string;
  descripcion: string;
  endpoint: string;
  // Nombre del query param de busqueda del backend (texto | placa | numero...).
  campoBusqueda?: string | null;
  columnas: Columna<T>[];
  acciones?: React.ReactNode;
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{titulo}</h1>
          <p className="text-muted-foreground text-sm">
            {descripcion}
            {isFetching && !isLoading && (
              <span className="ml-2 text-xs" aria-live="polite">Actualizando…</span>
            )}
          </p>
        </div>
        {acciones}
      </div>

      {campoBusqueda && (
        <div className="relative w-full max-w-xs">
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
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3" role="alert">
          <p className="text-sm text-destructive">
            {error instanceof ApiError ? error.message : "No se pudieron cargar los registros."}
          </p>
          <Button className="mt-3" variant="outline" size="sm" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      ) : (
      <div className="overflow-hidden rounded-lg border">
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
                <TableCell
                  colSpan={columnas.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  Sin registros todavía.
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
        <div className="flex items-center justify-between">
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
